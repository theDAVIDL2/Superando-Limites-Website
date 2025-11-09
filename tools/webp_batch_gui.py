"""
WebP Batch Converter with GUI

Features:
- Batch convert multiple images to optimized WebP in multiple widths
- Tkinter GUI: choose input/output, set widths, quality, and advanced options
- Presets for responsive widths, progress bar, logs, and multi-threaded processing
- Safe color/EXIF handling and optional lossless for transparent assets

Usage:
  python tools/webp_batch_gui.py

Dependencies:
  - Pillow (pip install pillow)
  - Tkinter (bundled with CPython on Windows/macOS; on some Linux distros install tk package)
"""

from __future__ import annotations

import concurrent.futures
import os
import sys
import threading
from dataclasses import dataclass
import json
from queue import Queue
from pathlib import Path
from typing import Iterable, List, Tuple

from PIL import Image, ImageOps

try:
    import tkinter as tk
    from tkinter import ttk, filedialog, messagebox
except Exception as e:  # pragma: no cover
    print("Tkinter is required to run this tool.")
    raise


SUPPORTED_EXTS = {".jpg", ".jpeg", ".png", ".tif", ".tiff", ".bmp", ".webp"}


@dataclass
class ConvertOptions:
    widths: List[int]
    quality: int
    keep_metadata: bool
    skip_upscale: bool
    lossless_for_alpha: bool
    name_pattern: str  # e.g. "{name}-{width}w.webp"
    threads: int


def parse_widths(text: str) -> List[int]:
    parts = [p.strip() for p in text.replace(";", ",").split(",") if p.strip()]
    widths: List[int] = []
    for p in parts:
        try:
            w = int(p)
            if w > 0:
                widths.append(w)
        except ValueError:
            pass
    # unique and sorted
    return sorted(set(widths))


def discover_images(input_dir: Path) -> List[Path]:
    images: List[Path] = []
    for root, _, files in os.walk(input_dir):
        for f in files:
            ext = Path(f).suffix.lower()
            if ext in SUPPORTED_EXTS:
                images.append(Path(root) / f)
    return images


def has_alpha(img: Image.Image) -> bool:
    if img.mode in ("RGBA", "LA"):
        return True
    if img.mode == "P":
        return "transparency" in img.info
    return False


def convert_single(
    src_path: Path,
    out_dir: Path,
    options: ConvertOptions,
) -> List[Path]:
    created: List[Path] = []
    with Image.open(src_path) as im_orig:
        im = ImageOps.exif_transpose(im_orig)

        # Prepare metadata
        exif_bytes = im.info.get("exif") if options.keep_metadata else None
        icc_profile = im.info.get("icc_profile") if options.keep_metadata else None
        alpha = has_alpha(im)

        # Convert to a safe working mode
        if alpha:
            im = im.convert("RGBA")
        else:
            im = im.convert("RGB")

        source_width, source_height = im.size
        target_widths = options.widths[:]
        if options.skip_upscale:
            target_widths = [min(w, source_width) for w in target_widths]
        # Deduplicate widths and ensure at least one output
        target_widths = sorted(set(max(1, w) for w in target_widths))
        if not target_widths:
            target_widths = [source_width]

        base_name = src_path.stem
        for w in target_widths:
            if w <= 1:
                continue
            if w == source_width:
                resized = im
                target_h = source_height
            else:
                target_h = int(round(source_height * (w / float(source_width))))
                resized = im.resize((w, target_h), resample=Image.LANCZOS)

            filename = options.name_pattern.format(name=base_name, width=w)
            out_path = out_dir / filename
            out_path.parent.mkdir(parents=True, exist_ok=True)

            save_kwargs = dict(format="WEBP", method=6)
            if alpha and options.lossless_for_alpha:
                save_kwargs.update(lossless=True)
            else:
                save_kwargs.update(quality=options.quality)

            if exif_bytes:
                save_kwargs["exif"] = exif_bytes
            if icc_profile:
                save_kwargs["icc_profile"] = icc_profile

            resized.save(out_path, **save_kwargs)
            created.append(out_path)

    return created


class App(tk.Tk):
    def __init__(self) -> None:
        super().__init__()
        self.title("WebP Converter — Responsive Batch")
        self.geometry("920x640")
        self.minsize(820, 560)

        # State vars
        self.input_dir = tk.StringVar()
        self.output_dir = tk.StringVar()
        self.widths_text = tk.StringVar(value="640, 768, 1024, 1280, 1536, 1920")
        self.quality = tk.IntVar(value=80)
        self.keep_metadata = tk.BooleanVar(value=False)
        self.skip_upscale = tk.BooleanVar(value=True)
        self.lossless_for_alpha = tk.BooleanVar(value=True)
        self.name_pattern = tk.StringVar(value="{name}-{width}w.webp")
        default_threads = max(2, min(32, (os.cpu_count() or 4)))
        self.threads = tk.IntVar(value=default_threads)

        self._images: List[Path] = []
        self._lock = threading.Lock()
        self._state_path = Path.home() / ".webp_batch_gui_state.json"
        self._images_done = 0

        self._build_ui()
        self._load_state()
        self.protocol("WM_DELETE_WINDOW", self._on_close)

    def _build_ui(self) -> None:
        pad = {"padx": 10, "pady": 8}

        # Paths frame
        frm_paths = ttk.LabelFrame(self, text="Pastas")
        frm_paths.pack(fill="x", **pad)

        ttk.Label(frm_paths, text="Entrada").grid(row=0, column=0, sticky="w")
        ttk.Entry(frm_paths, textvariable=self.input_dir).grid(row=0, column=1, sticky="ew", padx=6)
        ttk.Button(frm_paths, text="Procurar…", command=self._choose_input).grid(row=0, column=2)

        ttk.Label(frm_paths, text="Saída").grid(row=1, column=0, sticky="w")
        ttk.Entry(frm_paths, textvariable=self.output_dir).grid(row=1, column=1, sticky="ew", padx=6)
        ttk.Button(frm_paths, text="Procurar…", command=self._choose_output).grid(row=1, column=2)

        frm_paths.columnconfigure(1, weight=1)

        # Options frame
        frm_opts = ttk.LabelFrame(self, text="Opções")
        frm_opts.pack(fill="x", **pad)

        ttk.Label(frm_opts, text="Larguras (px)").grid(row=0, column=0, sticky="w")
        ttk.Entry(frm_opts, textvariable=self.widths_text).grid(row=0, column=1, sticky="ew", padx=6)
        ttk.Button(frm_opts, text="Presets", command=self._apply_presets).grid(row=0, column=2)

        ttk.Label(frm_opts, text="Qualidade").grid(row=1, column=0, sticky="w")
        ttk.Scale(frm_opts, from_=40, to=95, variable=self.quality, orient="horizontal").grid(row=1, column=1, sticky="ew", padx=6)
        ttk.Label(frm_opts, textvariable=self.quality).grid(row=1, column=2, sticky="e")

        ttk.Checkbutton(frm_opts, text="Manter metadados (EXIF/ICC)", variable=self.keep_metadata).grid(row=2, column=0, sticky="w")
        ttk.Checkbutton(frm_opts, text="Evitar upscale", variable=self.skip_upscale).grid(row=2, column=1, sticky="w")
        ttk.Checkbutton(frm_opts, text="Lossless se tiver transparência", variable=self.lossless_for_alpha).grid(row=2, column=2, sticky="w")

        ttk.Label(frm_opts, text="Padrão de nome").grid(row=3, column=0, sticky="w")
        ttk.Combobox(
            frm_opts,
            textvariable=self.name_pattern,
            values=["{name}-{width}w.webp", "{name}.w{width}.webp", "{name}_{width}.webp"],
            state="readonly",
        ).grid(row=3, column=1, sticky="ew", padx=6)

        ttk.Label(frm_opts, text="Threads").grid(row=3, column=2, sticky="e")
        ttk.Spinbox(frm_opts, from_=1, to=64, textvariable=self.threads, width=5).grid(row=3, column=3, sticky="w")

        for i in range(4):
            frm_opts.columnconfigure(i, weight=1)

        # Actions
        frm_actions = ttk.Frame(self)
        frm_actions.pack(fill="x", **pad)
        ttk.Button(frm_actions, text="Escanear imagens", command=self._scan).pack(side="left")
        ttk.Button(frm_actions, text="Converter", command=self._convert).pack(side="left", padx=8)
        ttk.Button(frm_actions, text="Abrir pasta de saída", command=self._open_output).pack(side="left")

        # Progress & Log
        frm_prog = ttk.Frame(self)
        frm_prog.pack(fill="both", expand=True, **pad)
        self.pbar = ttk.Progressbar(frm_prog, mode="determinate")
        self.pbar.pack(fill="x")

        self.log = tk.Text(frm_prog, height=18, wrap="word")
        self.log.pack(fill="both", expand=True, pady=(8, 0))

    # UI Handlers
    def _choose_input(self) -> None:
        directory = filedialog.askdirectory(title="Selecione a pasta de entrada")
        if directory:
            self.input_dir.set(directory)
            self._save_state()

    def _choose_output(self) -> None:
        directory = filedialog.askdirectory(title="Selecione a pasta de saída")
        if directory:
            self.output_dir.set(directory)
            self._save_state()

    def _apply_presets(self) -> None:
        self.widths_text.set("640, 768, 1024, 1280, 1536, 1920, 2048")

    def _scan(self) -> None:
        inp = Path(self.input_dir.get()) if self.input_dir.get() else None
        if not inp or not inp.exists():
            messagebox.showerror("Erro", "Selecione uma pasta de entrada válida.")
            return
        imgs = discover_images(inp)
        self._images = imgs
        self._log(f"Encontradas {len(imgs)} imagens suportadas em {inp}")

    def _convert(self) -> None:
        inp = Path(self.input_dir.get()) if self.input_dir.get() else None
        out = Path(self.output_dir.get()) if self.output_dir.get() else None
        if not inp or not inp.exists():
            messagebox.showerror("Erro", "Selecione uma pasta de entrada válida.")
            return
        if not out:
            messagebox.showerror("Erro", "Selecione uma pasta de saída.")
            return

        widths = parse_widths(self.widths_text.get())
        if not widths:
            messagebox.showerror("Erro", "Informe pelo menos uma largura válida.")
            return

        opts = ConvertOptions(
            widths=widths,
            quality=int(self.quality.get()),
            keep_metadata=bool(self.keep_metadata.get()),
            skip_upscale=bool(self.skip_upscale.get()),
            lossless_for_alpha=bool(self.lossless_for_alpha.get()),
            name_pattern=self.name_pattern.get(),
            threads=int(self.threads.get()),
        )

        images = self._images or discover_images(Path(self.input_dir.get()))
        if not images:
            messagebox.showwarning("Atenção", "Nenhuma imagem encontrada para converter.")
            return

        total_images = len(images)
        self._images_done = 0
        self.pbar.configure(maximum=total_images, value=0)
        self._log(
            f"Iniciando conversão: {len(images)} imagens, larguras={opts.widths}, qualidade={opts.quality}, threads={opts.threads}"
        )

        self.after(50, lambda: self._run_conversion(images, Path(self.output_dir.get()), opts))

    def _run_conversion(self, images: List[Path], out_dir: Path, opts: ConvertOptions) -> None:
        def task(img_path: Path) -> Tuple[str, int, str | None]:
            try:
                outputs = convert_single(img_path, out_dir, opts)
                return img_path.name, len(outputs), None
            except Exception as err:  # pragma: no cover - GUI tool
                return img_path.name, 0, str(err)

        self._log("Processando…")

        self._pending_futures: List[concurrent.futures.Future] = []
        self._executor = concurrent.futures.ThreadPoolExecutor(max_workers=opts.threads)
        for img in images:
            self._pending_futures.append(self._executor.submit(task, img))

        def poll():
            pending: List[concurrent.futures.Future] = []
            for f in self._pending_futures:
                if f.done():
                    name, count, err = f.result()
                    if err:
                        self._log(f"✗ {name}: erro {err}")
                    else:
                        self._log(f"✓ {name}: {count} variações geradas")
                    self._images_done += 1
                    self.pbar.configure(value=self._images_done)
                else:
                    pending.append(f)

            self._pending_futures = pending
            if pending:
                self.after(120, poll)
            else:
                try:
                    self._executor.shutdown(wait=False, cancel_futures=False)
                except Exception:
                    pass
                self._log("Finalizado.")
                self._save_state()

        self.after(150, poll)

    def _open_output(self) -> None:
        out = self.output_dir.get()
        if not out:
            return
        path = Path(out)
        try:
            if sys.platform.startswith("win"):
                os.startfile(str(path))  # type: ignore[attr-defined]
            elif sys.platform == "darwin":
                os.system(f"open '{path}'")
            else:
                os.system(f"xdg-open '{path}'")
        except Exception:
            pass

    # Logging helper
    def _log(self, text: str) -> None:
        self.log.insert("end", text + "\n")
        self.log.see("end")

    # State persistence
    def _load_state(self) -> None:
        try:
            if self._state_path.exists():
                data = json.loads(self._state_path.read_text(encoding="utf-8"))
                self.input_dir.set(data.get("input_dir", self.input_dir.get()))
                self.output_dir.set(data.get("output_dir", self.output_dir.get()))
                self.widths_text.set(data.get("widths_text", self.widths_text.get()))
                self.quality.set(int(data.get("quality", self.quality.get())))
                self.keep_metadata.set(bool(data.get("keep_metadata", self.keep_metadata.get())))
                self.skip_upscale.set(bool(data.get("skip_upscale", self.skip_upscale.get())))
                self.lossless_for_alpha.set(bool(data.get("lossless_for_alpha", self.lossless_for_alpha.get())))
                self.name_pattern.set(data.get("name_pattern", self.name_pattern.get()))
                self.threads.set(int(data.get("threads", self.threads.get())))
        except Exception:
            pass

    def _save_state(self) -> None:
        try:
            data = {
                "input_dir": self.input_dir.get(),
                "output_dir": self.output_dir.get(),
                "widths_text": self.widths_text.get(),
                "quality": int(self.quality.get()),
                "keep_metadata": bool(self.keep_metadata.get()),
                "skip_upscale": bool(self.skip_upscale.get()),
                "lossless_for_alpha": bool(self.lossless_for_alpha.get()),
                "name_pattern": self.name_pattern.get(),
                "threads": int(self.threads.get()),
            }
            self._state_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        except Exception:
            pass

    def _on_close(self) -> None:
        self._save_state()
        self.destroy()


def main() -> None:  # pragma: no cover - GUI entry
    app = App()
    app.mainloop()


if __name__ == "__main__":  # pragma: no cover
    main()



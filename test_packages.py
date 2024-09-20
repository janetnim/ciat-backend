import sys, subprocess

subprocess.run([sys.executable, "-m", "pip", "install", "numpy==1.26.4", "transformers", "torch", "Pillow", "timm", "matplotlib"])

import os

folder_path = "C:\my stuff\proiecte\boho-site-bio\biology-site-v2\public\gallery\medalie-bronz-2026"

for file in os.listdir(folder_path):
    print("![](/gallery/medalie-bronz-2026/"+file+")")

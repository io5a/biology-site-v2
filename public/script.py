import os

folder_path = "D:/Proiecte/biology lab v3/biology-lab/public/gallery/scoala-atfel2026"

for file in os.listdir(folder_path):
    print("![](/gallery/scoala-atfel2026/"+file+")")

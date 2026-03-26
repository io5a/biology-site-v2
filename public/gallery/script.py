import os

folder_path = "D:/Proiecte/biology lab v3/biology-lab/public/gallery/ziua-down-2026"

for file in os.listdir(folder_path):
    print("![](/gallery/ziua-down-2026/"+file+")")

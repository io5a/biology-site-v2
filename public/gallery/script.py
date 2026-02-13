import os

folder_path = "D:/Proiecte/biology lab v3/biology-lab/public/gallery/polenizarea-nocturna"

for file in os.listdir(folder_path):
    print("![](/gallery/polenizarea-nocturna/"+file+")")

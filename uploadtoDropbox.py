import os
import dropbox


dbx = dropbox.Dropbox('sl.A80Lu4k0rin2M16rhPs4xMe71lCR1s-j6Y0AHYz8RMyfVu4B9WtZ2V9gxhkx-4vVgKfYtPjg4Z2i_tKokEqA3Y80DUHfZqKzm3iOMUwKIQeJuTypNibhkpjD1WQbf2fq2bAeHzw') 
dbx.users_get_current_account()

for root, dirs, files in os.walk("/home/pi/Desktop/SSIDOutputFiles"):
    for file in files:
        if file.endswith(".txt"):
            f = open(os.path.join(root,file),'rb')
            dbx.files_upload(bytes(f.read()),'/Readings/output.txt',autorename=True) 
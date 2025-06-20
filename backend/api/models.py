from django.db import models
import os
import uuid
from .helpers import string_to_folder_path
from django.conf import settings
from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile
import stat


# Create your models here.
class Country(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class League(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Characteristics(models.Model):
    name = models.CharField(max_length=100, unique=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

def club_image_path(instance, filename):
    """Generate file path for uploaded images"""
    ext = filename.split(".")[-1]

    print(f"DEBUG: club image path for  {filename} is called")

    if not ((len(filename) - len (ext) == 47) and "_thumbnail." in filename):
        filename = f"{uuid.uuid4()}.{ext}"
        
    path = os.path.join("club_images/", str(instance.club.id), filename)

    # Create directory if it doesn't exist
    full_path = os.path.join(settings.MEDIA_ROOT, os.path.dirname(path))
    print(f"DEBUG: full path is {filename} ")
    os.makedirs(full_path, exist_ok=True)  # ← Critical for avoiding errors
    return path


class ClubImage(models.Model):
    club = models.ForeignKey(
        "FootballClub", on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to=club_image_path, blank=True, null=True)
    thumbnail = models.ImageField(
        upload_to=club_image_path, blank=True, null=True
    )  # New field
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "club_images"
        ordering = ["club"]

    def save(self, *args, **kwargs):
        # First save (creates the record if new)
        creating = not self.pk
        print(f"DEBUG: creating flag is set to: {creating}")
        super().save(*args, **kwargs)
        
        # Only process thumbnails for new images or when image changes
        if self.image and (creating or 'image' in kwargs.get('update_fields', [])):

            print("Debug: A thumbnail is being created for the image.")
            # Generate thumbnail filename
            img_name = os.path.basename(self.image.name)
            name, ext = os.path.splitext(img_name)
            thumbnail_name = f"{name}_thumbnail{ext}"
            
            print("Thumbnail name  is set to: ", thumbnail_name)

            # Create thumbnail
            img = Image.open(self.image)
            img.thumbnail((250, 250))
            
            # Save thumbnail to memory
            thumb_io = BytesIO()
            img.save(thumb_io, img.format or "JPEG", quality=85)
            thumb_io.seek(0)
            
            # Save to thumbnail field without triggering another save
            print("Save the thumbnail with name ", thumbnail_name)
            self.thumbnail.save(
                thumbnail_name, 
                ContentFile(thumb_io.read()),
                save=False
            )

            thumb_io.close()
            
            # Update only the thumbnail field
            print("Update field")
            super().save(update_fields=['thumbnail'])

    def delete(self, *args, **kwargs):
        print(f"DEBUG: Deleting image {self.image.name} for club {self.club.name}")
        
        # Get the name of the directory to clean it afterwards
        directory = ""
        if hasattr(self.image, "path"):  # Check if using local storage
            directory = os.path.dirname(self.image.path)
                                        
        # Delete associated files first
        if self.image:
            self.image.delete(save=False)  # Deletes original image file
        if self.thumbnail:
            self.thumbnail.delete(save=False)  # Deletes thumbnail file

        # Then delete the model instance
        super().delete(*args, **kwargs)

        # Optional: Clean up empty directory (only for local storage)
        print(f"DEBUG: Cleaning up directory {directory} if empty")

        print(f"DEBUG: Directory exists: {os.path.exists(directory)}")
        print(f"DEBUG: Directory is empty: {not os.listdir(directory) if directory else 'N/A'}")
        if directory != "" and os.path.exists(directory) and not os.listdir(directory):
            try:  
                print(f"DEBUG: Removing directory {directory}")      
                os.chmod(directory, stat.S_IWRITE)
                os.rmdir(directory)
            except Exception as e:
                print(f"Couldn't remove directory {directory}: {e}")

    def __str__(self):
        return f"Image for {self.club.name}"


class FootballClub(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=1000)
    attendance = models.IntegerField(null=True, blank=True)
    city = models.CharField(max_length=100)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name="clubs")
    league = models.ForeignKey(League, on_delete=models.CASCADE, related_name="clubs")
    characteristics = models.ManyToManyField(Characteristics, related_name="clubs")
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def has_images(self):
        """Check if club has any images uploaded"""
        return self.images.exists()
    
    def delete(self, *args, **kwargs):
        # Delete all images first
        for image in self.images.all():
            image.delete()
        # Then delete the club
        super().delete(*args, **kwargs)

    def __str__(self):
        return self.name

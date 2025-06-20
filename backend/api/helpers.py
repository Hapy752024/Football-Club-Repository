import re
import unicodedata

def string_to_folder_path(input_string):
    """
    Convert a string to a valid folder path string.
    
    Args:
        input_string (str): The input string to be converted.
        
    Returns:
        str: A sanitized string suitable for use as a folder path.
    """
    # Normalize unicode characters (convert accented characters to their base form)
    normalized = unicodedata.normalize('NFKD', input_string)
    
    # Remove special characters and replace with underscore
    # Allow alphanumeric, spaces, hyphens, and underscores
    sanitized = re.sub(r'[^\w\s-]', '_', normalized)
    
    # Replace spaces with underscores (you can change this to hyphens if preferred)
    sanitized = re.sub(r'\s+', '_', sanitized)
    
    # Remove consecutive underscores
    sanitized = re.sub(r'[_]+', '_', sanitized)
    
    # Remove leading/trailing underscores or hyphens
    sanitized = sanitized.strip('_')
    
    # Convert to lowercase (optional - remove if you want to preserve case)
    sanitized = sanitized.lower()
    
    # Ensure the string isn't empty after sanitization
    if not sanitized:
        return 'unnamed_folder'
    
    return sanitized

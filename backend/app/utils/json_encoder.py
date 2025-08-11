import json
from datetime import datetime, date

class DateTimeEncoder(json.JSONEncoder):
    """
    Custom JSON encoder for datetime objects
    Converts datetime objects to ISO format strings
    """
    def default(self, obj):
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        return super().default(obj)

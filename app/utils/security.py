from urllib.parse import urlparse, urljoin
from flask import request


def is_safe_redirect_url(target: str) -> bool:
    """
    Validate that a redirect URL is safe to prevent open redirect attacks
    """
    if not target:
        return False
    
    host_url = request.host_url
    ref_url = urlparse(host_url)
    test_url = urlparse(urljoin(host_url, target))
    
    return (test_url.scheme in ("http", "https") and 
            ref_url.netloc == test_url.netloc)

curl -F grant_type=authorization_code \
-F client_id=16312ad4625ac63660e140ef9cafdc36ed82512a2310f60e2cbeceaa906bf655 \
-F client_secret=80a45ff10c0a8fe3f758bc3e7ecc9a04866e21ce5be8751cc1a84677d0ab8b7d \
-F code=05f07c759a4784ac7563d81bc59f8999dd638b19b0d9ce01d4eea9d89ad021f3 \
-F redirect_uri=https://myawesomeweb.site/callback \
-X POST https://api.intra.42.fr/oauth/token

{
	"grant_type": "authorization_code",
	"client_id": "16312ad4625ac63660e140ef9cafdc36ed82512a2310f60e2cbeceaa906bf655",
	"client_secret": "80a45ff10c0a8fe3f758bc3e7ecc9a04866e21ce5be8751cc1a84677d0ab8b7d",
	"code": "05f07c759a4784ac7563d81bc59f8999dd638b19b0d9ce01d4eea9d89ad021f3",
	"redirect_uri": "https://myawesomeweb.site/callback"
}

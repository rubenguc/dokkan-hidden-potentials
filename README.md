# Dokkan battle hidden potentials

Database for the hidden potential of characters of dokkan battle.

The hidden potentials on the web may not be the best for any character; these are based on [Playmaker's guides](https://www.youtube.com/playlist?list=PL96oiZRZyU_Mm3z4WiVp7wfp1H4IFYV9Y)


## How to run

Config env
```
MONGODB_URI=mongodb://root:example@localhost:27017

# Server
CLOUDFLARE_ACCOUNT_ID=
R2_ACCESS_KEY=
R2_SECRET_KEY=
R2_BUCKET_NAME=
IMAGE_URL_SERVER=

# Admin
NEXT_PUBLIC_IMAGE_URL_SERVER= #same as IMAGE_URL_SERVER
```

run docker for local database:
```
docker compose up -d
```

run
```
npm run dev
```
FROM denoland/deno:1.28.0

WORKDIR /app
COPY . .

CMD [ "deno", "task", "dev" ]

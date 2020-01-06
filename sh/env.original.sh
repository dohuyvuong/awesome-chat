# Config database environment variable
export DB_CONNECTION=mongodb
export DB_HOST=localhost
export DB_PORT=27017
export DB_NAME=awesome_chat
export DB_USERNAME=
export DB_PASSWORD=

# Config app environment variable
export APP_HOST=0.0.0.0
export APP_PORT=8000

# Config session variable
export SESSION_KEY=awesome
export SESSION_SECRET=awesome

# Config admin email account
export MAIL_USER_NAME=Admin@Awesome
export MAIL_USER=gg.dohuyvuong.1@gmail.com
export MAIL_PASSWORD=mypass.word
export MAIL_HOST=smtp.gmail.com
export MAIL_PORT=587

# Config Facebook login app
export FB_APP_ID=670883036711803
export FB_APP_SECRET=f371534a53207c34cdefa68bc87abc06
export FB_CALLBACK_URL=https://localhost:8000/auth/facebook/callback

# Config Google login app
export GG_APP_ID=1022764880540-plpijh8k3jdodriccnv50of8eqursrab.apps.googleusercontent.com
export GG_APP_SECRET=m7kIMkzbHw1dy7HyHDG-GM7n
export GG_CALLBACK_URL=https://localhost:8000/auth/google/callback

module.exports = {
  deploy : {
    production : {
      user : 'mystraty',
      host : '138.68.87.59',
      ref  : 'origin/main',
      repo : 'https://github.com/GuetarniWalid/mystraty_front.git',
      path : '/var/www/front_mystraty/mystraty_front',
      'post-deploy' : 'npm install && npm run build',
    },
    development : {
      user : 'mystraty',
      host : '138.68.87.59',
      ref  : 'origin/dev',
      repo : 'https://github.com/GuetarniWalid/mystraty_front.git',
      path : '/var/www/front_mystraty/development',
      'post-deploy' : 'npm install && npm run build',
    }
  }
};
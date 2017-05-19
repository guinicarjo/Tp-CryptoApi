# Tp-CryptoApi

Serveur API de l'application CryptoApp

## Installation

ÉTAPE 1 : Installation de la machine virtuelle

sudo apt-get install vagrant virtualbox git
mkdir ~/work
cd ~/work
git clone https://github.com/scotch-io/scotch-box

dans ~/work/scotch-box modifier le fichier VagrantFile ligne 9 comme suit:

config.vm.synced_folder "../CryptoApi", "/var/www", :mount_options => ["dmode=777", "fmode=666"]

mkdir ~/work/CryptoApi
cd ~/work/scotch-box
vagrant up
vagrant ssh
cd /var/www

ETAPE 2 : Installation du serveur API

git clone https://github.com/guinicarjo/Tp-CryptoApi.git

node server.js

## Fonctionnement global du serveur API

Il s'agit d'un serveur sous nodejs et expressjs

La base de données est mongodb, l'API utilisera donc mongoose.

Les tokens seront géré avec JWT et passport.


Il y a 2 schema de model : user et message

user est défini par name(String),password(String) et publickey(String). 

message est défnini par dest(String), exp(String) et message(String)

dest et exp sont les abréviations pour destinataire et expéditeur

Les id sont gérés automatiquement par mongoose

Les messages enregistré sont stockée en étant déjà été  chiffrés dans l'application


Le serveur API permet de s'inscrire. On envoie avec la méthode POST un password et une publickey.

Pour générer un identifiant. On utilise le nom bob et on génére un nombre aléatoire entre 1 et 10000(Ce nombre peut etre augmenté en fonction du nombre d'utilisateur)

Si avec la génération aléatoire,un identifiant à déjà été créé, on relance une création d'identifiant jusqu'à qu'un identifiant soit libre.

Les mots de passe sont crypté avec bcrypt

Les données sont enregistrer en base de données

La requête renvoi un json avec la publickey, l'identifiant, un success true et un message indiquant que l'utilisateur a été créé


Le serveur API permet de s'authentifier.On envoie avec la méthode POST l'identifiant et le mot de passe.

Les mots de passes sont comparer avec bycript.

La requête enverra un json avec un success true et un token généré avec JWT.


Le serveur API permet également d'envoyer un message. On envoie avec la méthode POST un destinataire et le message. 

Le header doit contenir le token de l'expediteur ainsi que le Content-type application/x-www-form-urlencoded.

Le token en plus de servir de protection permettra de determiner le nom du destinataire.

On enregistre en base de donnée et on renvoi le json avec un success true et un message "Message envoyé"


Le serveur API permet également de recevoir un message. On utilisera la méthode POST. 

Le header doit contenir le token de l'expediteur ainsi que le Content-type application/x-www-form-urlencoded.

Le token en plus de servir de protection permettera de determiner le nom du destinataire.

Grâce au nom du destinataire on recupère le premier message, mais il aurait été plus pertinent de recupérer le dernier message(ajout d'un timestamp_createdAt et modified_At).

On renvoi un json avec un success true et le message recupéré crypté en base.


Et enfin l'API permet de récupérer une publickey.On utilisera la méthode POST avec l'identifiant de la personne a qui on veut récupérer la publickey.

Le header doit contenir le token de l'expediteur ainsi que le Content-type application/x-www-form-urlencoded.

Le token sert ici de protection.

Grace à l'identifiant on va chercher la personne dans la base de données.

Si la personne existe, on renvoi un json comprenant un success true et la publickey de la personne.


## Reste à faire

* Une table contact 
* Une table parametres
* Des controles de sécurité sur tous les points d'entrée utilisateur
* Utilisation du json pour les requêtes API
* Une fonction de modification de mot de passe
* Une fonction de desinscription de l'utilisateur
* Une fonction de suppression volontaire des messages par l'utilisateur
* Une fonction de suprresion automatique des anciens messages
* Une fonction pour gérer les status des messages lu/non lu

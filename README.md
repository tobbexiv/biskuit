[![biskuit Banner](https://raw.githubusercontent.com/mirkobrombin/biskuit-assets/ac2e599b0a83a4ed31d1fc74f47b340a96f61322/brand/biskuit-cover.png)](https://github.com/mirkobrombin/pagekit)

# bis[ku]it (Pagekit unofficial)
bis[ku]it is a modular and lightweight CMS built with Symfony components and Vue.js.

This unofficial version of Pagekit was created to solve various problems. Mainly born for linuxhub.it, a portal that uses PageKit.

The purpose is to solve various problems without introducing new features that could alter the structure of PageKit, allowing the update to the official branch in the future. However it is not said that in the future it is compatible with official updates and could take a completely different path.

Feel free to use it.

---

## Install from source
```
git clone https://github.com/mirkobrombin/pagekit.git
cd pagekit
```
Install dependencies using composer:
```
composer install
```
Continue installing from browser.

## Nginx configuration (optional)
In Nginx the .htaccess files are not supported, below the instructions for the Nginx configuration:
```
location / {
    location ~* ^.+\.(jpeg|jpg|png|gif|bmp|ico|svg|css|js)$ {
        expires     max;
    }
    try_files $uri $uri/ /index.php$is_args$args;
}

location ~ ^/index\.php(/|$) {
    fastcgi_pass   YOUR_SOCK;
    fastcgi_split_path_info ^(.+\.php)(/.*)$;
    include /etc/nginx/fastcgi_params; # this may be different
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    fastcgi_param HTTP_MOD_REWRITE On;
}

location ~ \.php$ {
    return 404;
}

```

## CLI

Pagekit offers a set of commands to run usual tasks on the command line. You can see the available commands with
```
./pagekit --help
```

## Contributing

Finding bugs, sending pull requests, translating Pagekit or improving our docs -
any contribution is welcome and highly appreciated. To get started, head over
to our [contribution guidelines](.github/CONTRIBUTING.md). Thanks!


## Credits

[Pagekit](http://www.pagekit.com) by YOOtheme [MIT license](LICENSE)  
[Half Dome Photo](http://www.youseethenew.com/landscape-outdoors/) by Brendan Lynch / [CC BY](http://creativecommons.org/licenses/by-nd/4.0/)  
Thanks to [Ruvim Miksanskiy](https://www.pexels.com/it-it/@digitech) for cover wallpaper

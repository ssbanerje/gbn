#!/bin/bash

rm -rf lyrics notation

wget -r http://geetabitan.com/

mkdir lyrics
mkdir notation

cd lyrics
mkdir A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
cd ../notation
mkdir A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
cd ..

perl exl.pl

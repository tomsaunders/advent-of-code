#!/usr/bin/env php
<?php $f = fopen('halting.txt', 'r');
$seen = [];
while ($line = fgets($f)) {
    if (isset($seen[$line])) {
        exit();
    } else {
        echo $line;
        $seen[$line] = 1;
    }
}

#!/usr/bin/env php
<?php

$in = 'hwlqcszp';
$size = 128;

function knothash($input){
    $list = range(0,255);
    $pos = 0;
    $skip = 0;
    
    
    for($i=0; $i<strlen($input); $i++){
        $lengths[] = ord($input[$i]);
    }
    array_push($lengths,"17", "31", "73", "47", "23");
    
    for($r = 0; $r<64; $r++){
        foreach($lengths as $x){
            $reverse = array();
            for($i=0; $i<$x; $i++){
                $reverse[] = $list[($pos+$i)%256];
            }
            $reverse = array_reverse($reverse);
            for($i=0; $i<$x; $i++){
                $list[($pos+$i)%256] = $reverse[$i];
            }
            $pos += $x + $skip;
            $skip++;
        }
    }
    
    $sparse = array_chunk($list, 16);
    
    foreach($sparse as $x){
        $xor = 0;   
        foreach($x as $y){
            $xor ^= $y;
        }
        $dense[] = $xor;
    }
    
    $knot = "";
    foreach($dense as $x){
        $knot .= str_pad(dechex($x), 2, '0', STR_PAD_LEFT);
    }
    return $knot;
}

function binhash($hexhash){
    $hexhash = knothash($hexhash);
    $o = '';
    for ($i = 0; $i < strlen($hexhash); $i++){
        $o .= str_pad(decbin(hexdec($hexhash[$i])), 4, '0', STR_PAD_LEFT);
        
    }
    return $o;
}
$used = 0;
$tst = 'flqrgnkx';
// $in = $tst;
$rows = [];
for ($i = 0; $i < $size; $i++){
    $row = binhash("$in-$i");

    $x = str_replace(['0', '1'], ['.', '#'], $row);

    $used += strlen(str_replace('.', '', $x));
    $rows[] = $row;
}
echo $used;
echo "\n";
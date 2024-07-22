<?php

// $numbers = [65,27,9,1,4,3,40,50,91,7,6,0,2,5,68,22];
// $dense = [];
// for ($x = 0; $x < 1; $x++){
//     $startPos = $x * 1;
//     $hash = $numbers[$startPos];
//     for ($y = 1; $y < 16; $y++){
//         $pos = $startPos + $y;
//         $next = $numbers[$pos];
//         $hash = $hash ^ $next;
//     }
//     $dense[$x] = dechex($hash);
// }
// echo implode("", $dense);
// echo "\n";
// exit;

$in = file_get_contents('10.txt');
$tst = "3, 4, 1, 5";
$size = 256; 

// $in = "1,2,4";
// $size = 5;

$lengths = [];
for ($l = 0; $l < strlen($in); $l++){
    $lengths[] = ord($in[$l]);
}

$suffix = [17, 31, 73, 47, 23];
$lengths= array_merge($lengths, $suffix);
$rounds = 64;
$round = 0;

$pos = 0;
$skip = 0;

$numbers = [];
for ($n = 0; $n < $size; $n++) $numbers[] = $n;

for ($round = 0; $round < $rounds; $round++){
    for ($l = 0; $l < count($lengths); $l++){
        $len = $lengths[$l];

        $old = $numbers;
        for ($i = 0; $i < $len; $i++){
            $takeFrom = ($pos + $len - $i - 1) % $size;
            $giveTo = ($i + $pos) % $size;
            $numbers[$giveTo] = $old[$takeFrom];
        }
    
        $pos += $skip + $len;
        $pos %= $size;
        $skip++;
    }
}

function zeropad($num, $lim)
{
   return (strlen($num) >= $lim) ? $num : zeropad("0" . $num, $lim);
}

$dense = [];
for ($x = 0; $x < 16; $x++){
    $startPos = $x * 16;
    $hash = $numbers[$startPos];
    for ($y = 1; $y < 16; $y++){
        $pos = $startPos + $y;
        $next = $numbers[$pos];
        $hash = $hash ^ $next;
    }
    $dense[$x] = zeropad(dechex($hash) , 2);
}
echo implode("", $dense);
echo "\n";
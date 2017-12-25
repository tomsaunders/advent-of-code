#!/usr/bin/env php
<?php
$a = $b = $c = $d = $e = $f = $g = $h = 0;
$a = 1;
$b = 81;
$c = $b;
if ($a !== 0) {
    $b = 8100 + 100000;
    $c = $b + 17000;
}
$dd = $c - $b;
$ob = $b;
for (; $b <= $c; $b += 17){
    $p = round(($b-$ob) / $dd * 100) . '%';
    echo "$b $p\n";
    $s = sqrt($b);
    $on = TRUE;
    $i = 2;
    while ($i <= $s && $on){
        if ($b % $i == 0) {
            $h++;
            $on = FALSE;
        }
        $i++;
    }
    // for ($d = 2; $d <= $s; $d++){
    //     for ($e = 2; $e <= $b / 2; $e++){
    //         if (($d * $e) == $b) {
    //             $h++;
    //             // break 2;
    //         }
    //     }
    // }
}
echo "H: $h\n";
echo "$a $b $c $d $e $f $g $h\n";
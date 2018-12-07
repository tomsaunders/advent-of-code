#!/usr/bin/env php
<?php
$in = file_get_contents('input2.txt');
$lines = explode("\n", $in);

$twoCount = 0;
$threeCount = 0;

foreach ($lines as $line){
    $seen = [];
    for ($i = 0; $i < strlen($line); $i++){
        $c = $line[$i];
        if (!isset($seen[$c])) $seen[$c] = 0;
        $seen[$c]++;
    }
    $hasTwo = false;
    $hasThree = false;
    foreach ($seen as $letter => $count){
        if ($count === 2) {
            $hasTwo = true;
        } elseif ($count === 3){
            $hasThree = true;
        }
    }
    if ($hasTwo) {
        $twoCount++;
    }
    if ($hasThree){
        $threeCount++;
    }
}
$prod = $twoCount * $threeCount;
echo "Twos $twoCount Threes $threeCount checksum $prod \n\n";

$lc = count($lines);
for ($a = 0; $a < $lc; $a++){
    $wa = $lines[$a];
    for ($b = $a + 1; $b < $lc; $b++){
        $wb = $lines[$b];
        $diff = 0;
        $same = '';
        for ($i = 0; $i < 26; $i++){
            if ($wa[$i] !== $wb[$i]) {
                $diff++;
            } else {
                $same .= $wa[$i];
            }
        }
        if ($diff === 1) {
            echo "\n\n$wa and $wb are super similar and the commonality is $same \n\n";
        }
    }
}
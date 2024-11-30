<?php

$in = file_get_contents('12.txt');
$tst = <<<TST
0 <-> 2
1 <-> 1
2 <-> 0, 3, 4
3 <-> 2, 4
4 <-> 2, 3, 6
5 <-> 6
6 <-> 4, 5
TST;

// $in = $tst;
$lines = explode("\n", $in);
$links = [];

// for ($i = 0; $i < 3000; $i++) $links[$i] = [];

foreach ($lines as $line){
    list($left, $right) = explode(" <-> ", $line);
    $rights = explode(", ", $right);
    $links[$left] = $rights;
}
$groups = 0;
$ungrouped = array_keys($links);

while (count($ungrouped)){
    $check = reset($ungrouped);
    $conns = [$check => TRUE];
    $seek = $links[$check];

    while (count($seek)){
        $next = [];
        foreach ($seek as $s){
            if (!isset($conns[$s])){
                $conns[$s] = TRUE;
            }

            foreach ($links[$s] as $n){
                if (!isset($conns[$n])){
                    $conns[$n] = TRUE;
                    $next[] = $n;
                }
            }
        }
        $seek = $next;
    }
    $groups++;
    echo "Group $groups: ";
    $found = array_keys($conns);
    echo count($found) . PHP_EOL;
    $ungrouped = array_diff($ungrouped, $found);
}
echo "\tGroups $groups\n";
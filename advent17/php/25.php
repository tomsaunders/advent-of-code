#!/usr/bin/env php
<?php
ini_set('memory_limit', '2G');
$in = file_get_contents('25.txt');

$states = [
    'A' => [
        0 => [1, 1, 'B'],
        1 => [1, -1, 'E']
    ],
    'B' => [
        0 => [1, 1, 'C'],
        1 => [1, 1, 'F']
    ],
    'C' => [
        0 => [1, -1, 'D'],
        1 => [0, 1, 'B']
    ],
    'D' => [
        0 => [1, 1, 'E'],
        1 => [0, -1, 'C']
    ],
    'E' => [
        0 => [1, -1, 'A'],
        1 => [0, 1, 'D']
    ],
    'F' => [
        0 => [1, 1, 'A'],
        1 => [1, 1, 'C']
    ]
    ];
    $steps = 12523873;

// $states = [
    // 'A' => [
    //     0 => [1, 1, 'B'],
    //     1 => [0, -1, 'B']
    // ],
    // 'B' => [
    //     0 => [1, -1, 'A'],
    //     1 => [1, 1, 'A']
    // ]
    // ];
    // $steps = 6;


$slots = [];
$pos = 0;
$state = 'A';

for ($i = 0; $i < $steps; $i++){
    $val = isset($slots[$pos]) ? $slots[$pos] : 0;
    // echo "$i $state pos $pos val $val\n";
    $next = $states[$state][$val];
    list($write, $move, $state) = $next;
    // echo "writing $write at $pos and moving $move new state $state\n";
    $slots[$pos] = $write;
    $pos += $move;
    // echo implode(" ", $slots) . " ; $state\n";
}

echo array_sum($slots);

echo "\n";


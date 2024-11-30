#!/usr/bin/env php
<?php
$in = file_get_contents('input7.txt');
$test = <<<TST
Step C must be finished before step A can begin.
Step C must be finished before step F can begin.
Step A must be finished before step B can begin.
Step A must be finished before step D can begin.
Step B must be finished before step E can begin.
Step D must be finished before step E can begin.
Step F must be finished before step E can begin.
TST;
$workers = 5;
$base = 60;

// $in = $test;
// $workers = 2;
// $base = 0;

$lines = explode("\n", $in);

$stepNames = [];
$prereqs = [];
$done = [];
foreach ($lines as $line){
    $l = str_replace(['Step ', 'must be finished before step ', 'can begin.'],'', $line);
    list($first, $then) = explode(" ", $l);
    $stepNames[$first] = 1;
    $stepNames[$then] = 1;
    $prereqs[$then][] = $first;
}
$stepNames = array_keys($stepNames);
sort($stepNames);

foreach ($stepNames as $c){
    $done[$c] = 0;
    $prereqs[$c] = [];
}
foreach ($lines as $line){
    $l = str_replace(['Step ', 'must be finished before step ', 'can begin.'],'', $line);
    list($first, $then) = explode(" ", $l);
    $prereqs[$then][] = $first;
}

$prereqs2 = $prereqs;
$did = [];
while (count($prereqs)){
    $canDo = [];
    $nextReqs = [];
    foreach ($prereqs as $letter => $reqs){
        if (empty($reqs)){
            $canDo[] = $letter;
        }
        $nextReqs[$letter] = $reqs;
    }
    sort($canDo);
    $do = array_shift($canDo);
    unset($nextReqs[$do]);
    // echo "Doing $do\n\n";

    $prereqs = $nextReqs;
    $nextReqs = [];
    foreach ($prereqs as $letter => $reqs){
        $nextReqs[$letter] = array_filter($reqs, function($letter) use ($do){
            return $letter !== $do;
        });
    } 
    $prereqs = $nextReqs;
    $did[] = $do;
}

echo "Part 1: " . implode('', $did) . PHP_EOL;

$time = 0;
$availAt = array_pad([], $workers, 0);
$didAt = [];
$prereqs = $prereqs2;
while (count($didAt) !== count($prereqs2) && $time < 1000){
    $canDo = [];
    foreach ($prereqs as $letter => $reqs){
        $possible = true;
        foreach ($reqs as $r) {
            if (isset($didAt[$r]) && $didAt[$r] <= $time) {
                // possible
            } else {
                $possible = false;
            }
        }
        if ($possible){
            $canDo[] = $letter;
        }
    }
    sort($canDo);
    echo "T $time Done " . count($didAt) . ' out of ' . count($prereqs2) . PHP_EOL;
    echo "T $time remaining " . implode(", ", array_keys($prereqs)) . PHP_EOL;
    echo "T $time Could do " . implode(', ', $canDo) . PHP_EOL;
    echo "T $time workers available at " . implode(', ', $availAt) . PHP_EOL;
    for ($w = 0; $w < count($availAt) && count($canDo); $w++){
        if ($availAt[$w] <= $time) {
            $do = array_shift($canDo);
            $willTake = ord($do) - 64 + $base;
            $t = $time + $willTake;
            echo "W $w doing $do will take $willTake and finish at $t\n";
            unset($prereqs[$do]);
            $didAt[$do] = $t;
            $availAt[$w] = $t;
        }
    }
    $time++;
    // echo "\n";
}
echo "Part 2 Max time : " . max($didAt);
echo "\n";
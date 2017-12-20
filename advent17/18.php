#!/usr/bin/env php
<?php
$in = file_get_contents('18.txt');
$registers = [];
foreach (str_split('abcdefghijklmnopqrstuvwxyz') as $l) $registers[$l] = 0;
$registers = ['a' => 0];

// $in = <<<TST
// set a 1
// add a 2
// mul a a
// mod a 5
// snd a
// set a 0
// rcv a
// jgz a -1
// set a 1
// jgz a -2
// TST;

$lines = explode("\n", $in);
$pos = 0;
$snd = 0;
$rec = 0;

while($pos < count($lines)){
    $line = $lines[$pos];
    
    $bits = explode(' ', $line);
    $bits[] = 'ignored';
    list($op, $reg, $val) = $bits;
    
    $rval = is_numeric($reg) ? $reg : $registers[$reg];
    if (!is_numeric($val)) $val = $registers[$val];

    if ($op === 'snd'){
        $snd = $rval;
    } else if ($op === 'set') {
        $registers[$reg] = $val;
    } else if ($op === 'add') {
        $registers[$reg] += $val;
    } else if ($op === 'mul') {
        $registers[$reg] *= $val;
    } else if ($op === 'mod') {
        $registers[$reg] %= $val;
    } else if ($op === 'rcv') {
        if ($rval > 0) {
            $rec = $snd;
            echo "Last sound $snd\n\n"; exit;
        }
    } else if ($op === 'jgz') {
        if ($rval > 0) {
            $pos += $val;
            continue;
        }
    }    
    $pos++;
}
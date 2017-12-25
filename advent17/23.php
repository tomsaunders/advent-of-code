#!/usr/bin/env php
<?php
$in = file_get_contents('23.txt');
$registers = [];
foreach (str_split('abcdefgh') as $l) $registers[$l] = 0;
$registers['a'] = 1; //part b

$lines = explode("\n", $in);
$pos = 0;
$mul = 0;

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
    } else if ($op === 'sub') {
        $registers[$reg] -= $val;
    } else if ($op === 'mul') {
        $registers[$reg] *= $val;
        $mul++;
    } else if ($op === 'mod') {
        $registers[$reg] %= $val;
    } else if ($op === 'rcv') {

    } else if ($op === 'jnz') {
        if ($rval !== 0) {
            $pos += $val;
            continue;
        }
    }    
    $pos++;
}
echo "Mul $mul\n";
print_r($registers);

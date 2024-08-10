#!/usr/bin/env php
<?php $in = file_get_contents('input21.txt');
$test = <<<TST
#ip 0
seti 5 0 1
seti 6 0 2
addi 0 1 0
addr 1 2 3
setr 1 0 0
seti 8 0 4
seti 9 0 5
TST;
// $in = $test;
$lines = explode("\n", $in);

$registers = [0, 0, 0, 0, 0, 0];
// $registers = [1,0,0,0,0,0];

global $codes;
$codes = [
    'addr',
    'addi',
    'mulr',
    'muli',
    'banr',
    'bani',
    'borr',
    'bori',
    'setr',
    'seti',
    'gtir',
    'gtri',
    'gtrr',
    'eqir',
    'eqri',
    'eqrr'
];

function addr($r, $set)
{
    list($opcode, $a, $b, $c) = $set;
    $out = $r;
    $out[$c] = $r[$a] + $r[$b];
    // echo "r{$c} = r{$a} + r{$b}\n";
    return $out;
}

function addi($r, $set)
{
    list($opcode, $a, $b, $c) = $set;
    $out = $r;
    $out[$c] = $r[$a] + $b;
    // echo "r{$c} = r{$a} + $b\n";
    return $out;
}

function mulr($r, $set)
{
    list($opcode, $a, $b, $c) = $set;
    $out = $r;
    $out[$c] = $r[$a] * $r[$b];
    // echo "r{$c} = r{$a} * r{$b}\n";
    return $out;
}

function muli($r, $set)
{
    list($opcode, $a, $b, $c) = $set;
    $out = $r;
    $out[$c] = $r[$a] * $b;
    // echo "r{$c} = r{$a} * $b\n";
    return $out;
}

function banr($r, $set)
{
    list($opcode, $a, $b, $c) = $set;
    $out = $r;
    $out[$c] = $r[$a] & $r[$b];
    // echo "r{$c} = r{$a} & r{$b}\n";
    return $out;
}

function bani($r, $set)
{
    list($opcode, $a, $b, $c) = $set;
    $out = $r;
    $out[$c] = $r[$a] & $b;
    // echo "r{$c} = r{$a} & {$b}\n";
    return $out;
}

function borr($r, $set)
{
    list($opcode, $a, $b, $c) = $set;
    $out = $r;
    $out[$c] = $r[$a] | $r[$b];
    // echo "r{$c} = r{$a} | r{$b}\n";
    return $out;
}

function bori($r, $set)
{
    list($opcode, $a, $b, $c) = $set;
    $out = $r;
    $out[$c] = $r[$a] | $b;
    // echo "r{$c} = r{$a} & {$b}\n";
    return $out;
}

function setr($r, $set)
{
    list($opcode, $a, $b, $c) = $set;
    $out = $r;
    $out[$c] = $r[$a];
    // echo "r{$c} = r{$a}\n";
    return $out;
}

function seti($r, $set)
{
    list($opcode, $a, $b, $c) = $set;
    $out = $r;
    $out[$c] = $a;
    // echo "r{$c} = $a\n";
    return $out;
}

function gtrr($r, $set)
{
    list($opcode, $a, $b, $c) = $set;
    $out = $r;
    $out[$c] = $r[$a] > $r[$b] ? 1 : 0;
    // echo "is r{$a} > r{$b} ?\n";
    return $out;
}

function gtri($r, $set)
{
    list($opcode, $a, $b, $c) = $set;
    $out = $r;
    $out[$c] = $r[$a] > $b ? 1 : 0;
    // echo "is r{$a} > {$b} ?\n";
    return $out;
}

function gtir($r, $set)
{
    list($opcode, $a, $b, $c) = $set;
    $out = $r;
    $out[$c] = $a > $r[$b] ? 1 : 0;
    // echo "is {$a} > r{$b} ?\n";
    return $out;
}

function eqrr($r, $set)
{
    list($opcode, $a, $b, $c) = $set;
    $out = $r;
    $out[$c] = $r[$a] == $r[$b] ? 1 : 0;
    // echo "is r{$a} == r{$b} ?\n";
    return $out;
}

function eqri($r, $set)
{
    list($opcode, $a, $b, $c) = $set;
    $out = $r;
    $out[$c] = $r[$a] == $b ? 1 : 0;
    // echo "is r{$a} == {$b} ?\n";
    return $out;
}

function eqir($r, $set)
{
    list($opcode, $a, $b, $c) = $set;
    $out = $r;
    $out[$c] = $a == $r[$b] ? 1 : 0;
    // echo "is {$a} == r{$b} ?\n";
    return $out;
}

$ins = [];
$ip = 0;
$x = [0, 0, 0, 0, 0, 0];
foreach ($lines as $z => $line) {
    if (substr($line, 0, 3) === '#ip') {
        list(, $ip) = explode(' ', $line);
    } else {
        // normal line
        list($opcode, $a, $b, $c) = explode(' ', $line);
        $in = [$opcode, (int) $a, (int) $b, (int) $c];
        $ins[] = $in;
        // echo "$line ";
        // echo str_pad($z - 1, 3, '0', STR_PAD_LEFT) . ' ';
        $x = call_user_func($opcode, $x, $in);
        // // echo implode(", ", $x) . "\n\n";
    }
}
// exit();

$iCount = count($ins);
$bound = $ip;
$ip = 0;
$executed = 0;
$seen = [];
// $registers[0] = 10504829;

while ($ip < $iCount) {
    $in = $ins[$ip];
    $registers[$bound] = $ip;

    $o = "ip=$ip [";
    $o .= implode(", ", $registers);
    $o .= "] ";
    $o .= implode(" ", $in);
    $o .= " [";
    list($opcode, $a, $b, $c) = $in;
    $registers = call_user_func($opcode, $registers, $in);
    $o .= implode(", ", $registers);
    $o .= "]\n\n";
    if ($ip == 6) {
        $r3 = $registers[3];
        if (isset($seen[$r3])) {
            break;
        }
        $seen[$r3] = true;
        echo $executed . '  - ' . count($seen) . ' - ' . $o;
    }
    $ip = $registers[$bound];
    $ip++;
    $executed++;
}

print_r($registers);
echo "$executed executed\n";
print_r($seen);

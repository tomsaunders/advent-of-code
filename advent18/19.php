#!/usr/bin/env php
<?php
$in = file_get_contents('input19.txt');
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

$registers = [0,0,0,0,0,0];
// $registers = [1,0,0,0,0,0];

global $codes;
$codes = ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'];

function addr($r, $set){
	list($opcode, $a, $b, $c) = $set;
	$out = $r;
	$out[$c] = $r[$a] + $r[$b];
	return $out;
}

function addi($r, $set){
	list($opcode, $a, $b, $c) = $set;
	$out = $r;
	$out[$c] = $r[$a] + $b;
	return $out;
}

function mulr($r, $set){
	list($opcode, $a, $b, $c) = $set;
	$out = $r;
	$out[$c] = $r[$a] * $r[$b];
	return $out;
}

function muli($r, $set){
	list($opcode, $a, $b, $c) = $set;
	$out = $r;
	$out[$c] = $r[$a] * $b;
	return $out;
}

function banr($r, $set){
	list($opcode, $a, $b, $c) = $set;
	$out = $r;
	$out[$c] = $r[$a] & $r[$b];
	return $out;
}

function bani($r, $set){
	list($opcode, $a, $b, $c) = $set;
	$out = $r;
	$out[$c] = $r[$a] & $b;
	return $out;
}

function borr($r, $set){
	list($opcode, $a, $b, $c) = $set;
	$out = $r;
	$out[$c] = $r[$a] | $r[$b];
	return $out;
}

function bori($r, $set){
	list($opcode, $a, $b, $c) = $set;
	$out = $r;
	$out[$c] = $r[$a] | $b;
	return $out;
}

function setr($r, $set){
	list($opcode, $a, $b, $c) = $set;
	$out = $r;
	$out[$c] = $r[$a];
	return $out;
}

function seti($r, $set){
	list($opcode, $a, $b, $c) = $set;
	$out = $r;
	$out[$c] = $a;
	return $out;
}

function gtrr($r, $set){
	list($opcode, $a, $b, $c) = $set;
	$out = $r;
	$out[$c] = $r[$a] > $r[$b] ? 1 : 0;
	return $out;
}

function gtri($r, $set){
	list($opcode, $a, $b, $c) = $set;
	$out = $r;
	$out[$c] = $r[$a] > $b ? 1 : 0;
	return $out;
}

function gtir($r, $set){
	list($opcode, $a, $b, $c) = $set;
	$out = $r;
	$out[$c] = $a > $r[$b] ? 1 : 0;
	return $out;
}

function eqrr($r, $set){
	list($opcode, $a, $b, $c) = $set;
	$out = $r;
	$out[$c] = $r[$a] == $r[$b] ? 1 : 0;
	return $out;
}

function eqri($r, $set){
	list($opcode, $a, $b, $c) = $set;
	$out = $r;
	$out[$c] = $r[$a] == $b ? 1 : 0;
	return $out;
}

function eqir($r, $set){
	list($opcode, $a, $b, $c) = $set;
	$out = $r;
	$out[$c] = $a == $r[$b] ? 1 : 0;
	return $out;
}

$ins = [];
$ip = 0;
foreach ($lines as $line){
	if (substr($line, 0,3) === '#ip'){
		list(, $ip) = explode(' ', $line);
	} else {
		// normal line
		$ins[] = explode(' ', $line);
	}
}

$iCount = count($ins);
$bound = $ip;
$ip = 0;
while ($ip < $iCount){
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
	$o .= "]\n";
	echo $o;
	$ip = $registers[$bound];
	$ip++;
}

print_r($registers);
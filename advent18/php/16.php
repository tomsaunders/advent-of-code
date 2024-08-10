#!/usr/bin/env php
<?php
$in = file_get_contents('input16a.txt');
$test = <<<TST
Before: [3, 2, 1, 1]
9 2 1 2
After:  [3, 2, 2, 1]
TST;
//$in = $test;
$lines = explode("\n", $in);

$registers = [0,0,0,0];

global $opfuzz;
global $codes;
$codes = ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'];
$opfuzz = array_pad([], 16, $codes);


function matchCode($before, $set, $after){
	$opcode = $set[0];
	global $codes;
	global $opfuzz;
//	$codes = ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'];
	$matched = [];
	foreach ($codes as $code){
		$out = call_user_func($code, $before, $set);
		if ($out == $after){
			$matched[] = $code;
		} else {
			$opfuzz[$opcode] = array_filter($opfuzz[$opcode], function($c) use ($code){
				return $c != $code;
			});
		}
	}
	return $matched;
}

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

$matchedThree = 0;
$opcodes = [];
//$opfuzz = [];
//$codes = ['addr', 'addi', 'mulr', 'muli', 'banr', 'bani', 'borr', 'bori', 'setr', 'seti', 'gtir', 'gtri', 'gtrr', 'eqir', 'eqri', 'eqrr'];
//foreach ($codes as $code){
//	$opfuzz[$code] = array_pad([], count($codes), 0);
//}

for ($i = 0; $i < count($lines); $i++){
	$line = trim($lines[$i]);
	if (!$line){
		$i++;
	}
	$before = explode(', ', str_replace(['Before: [', ']'], '', $lines[$i]));
	$i++;
	$set = explode(' ', $lines[$i]);
	$opcode = $set[0];
	$i++;
	$after = explode(', ', str_replace(['After:  [', ']'], '', $lines[$i]));
	$matches = matchCode($before, $set, $after);
	$mc = count($matches);
//	echo "Matched {$mc}!\n";
	if ($mc >= 3){
		$matchedThree++;
	} else if  ($mc == 1) {
		$opcodes[$matches[0]] = $opcode;
	}
//	foreach ($matches as $match){
//		$opfuzz[$match][$opcode]++;
//	}
}

while (count($opcodes) < 16){
	foreach ($opfuzz as $opcode => $options){
		$options = array_diff($options, array_keys($opcodes));
		if (count($options) == 1){
			$code = array_shift($options);
			$opcodes[$code] = $opcode;
		}
	}
}


echo "Part1:\n"; // 132
echo $matchedThree;
echo "\n";
//print_r($opcodes);
//print_r($opfuzz);

$realops = [];
foreach ($opcodes as $code => $opcode){
	$realops[$opcode] = $code;
}

echo "Part2:\n"; //229
$in = file_get_contents('input16b.txt');
$registers = [0,0,0,0];
$lines = explode("\n", $in);
foreach ($lines as $line){
	$set = explode(' ', $line);
	$opcode = $set[0];
	$func = $realops[$opcode];
//	echo "$line $opcode $func \n";
//	exit;
	$registers = call_user_func($func, $registers, $set);
}

echo "\n";
print_r($registers);
#!/usr/bin/env php
<?php
date_default_timezone_set('Australia/Canberra');
$in = file_get_contents('input4.txt');
$lines = explode("\n", $in);

$test = <<<TST
[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
[1518-11-02 00:40] falls asleep
[1518-11-02 00:50] wakes up
[1518-11-03 00:05] Guard #10 begins shift
[1518-11-03 00:24] falls asleep
[1518-11-03 00:29] wakes up
[1518-11-04 00:02] Guard #99 begins shift
[1518-11-04 00:36] falls asleep
[1518-11-04 00:46] wakes up
[1518-11-05 00:03] Guard #99 begins shift
[1518-11-05 00:45] falls asleep
[1518-11-05 00:55] wakes up
TST;

// $lines = explode("\n", $test);
define('ASLEEP', 'falls');
define('AWAKE', 'wakes');
define('GUARD', 'Guard');

$lines[] = "[2019-11-05 00:55] Guard #999999999 begins shift";

$arr = [];
foreach ($lines as $line){
    $line = str_replace(['[', ']', '#'], '', $line);
    list($date, $time, $ins, $oth) = explode(" ", $line);

    $date = str_replace('1518', '2018', $date);
    $ts = strtotime("{$date}T{$time}");
    $arr[] = [$ts, $date, $time, $ins, $oth];
}

usort($arr, function($a, $b){
    return $a[0] - $b[0];
});
print_r(
    array_map(function($a) { 
        return implode('-', $a);
    }, $arr)
);

$guards = [];
$day = '';
$guard = 0;
$today = array_pad([], 60, 0);
foreach ($arr as $a){
    list($ts, $date, $time, $in, $oth) = $a;
    list($hr, $mn) = explode(":", $time);
    if ($date !== $day) {
        
    }
    if ($in === GUARD) {
        if ($guard) {
            //save today against previous guard
            if (!isset($guards[$guard])){
                $guards[$guard] = newGuard($guard);
            }
            // echo "Today $date for guard $guard is " . implode('', $today) . PHP_EOL;
            for ($i = 0; $i < 60; $i++){
                if ($today[$i] === 1){
                    $guards[$guard]['total']++;
                    $guards[$guard]['minutes'][$i]++;
                }
            }
            $today = array_pad([], 60, 0);
            $day = $date;
        }
        $guard = $oth;
    } else if ($in === ASLEEP){
        for ($i = $mn; $i < 60; $i++){
            $today[$i] = 1;
        }
    } else if ($in === AWAKE) {
        for ($i = $mn; $i < 60; $i++){
            $today[$i] = 0;
        }
    }
}

function newGuard($id) {
    return ['id' => $id, 'total' => 0, 'minutes' => array_pad([], 60, 0)];
}

$totals = [];
foreach ($guards as $guard){
    $totals[$guard['id']] = $guard['total'];
}

$max = max($totals);
$at = array_search($max, $totals);

$sleepiest = $guards[$at];

$max = max($sleepiest['minutes']);
$at = array_search($max, $sleepiest['minutes']);
$chk = $sleepiest['id'] * $at;
echo "Guard {$sleepiest['id']} Total {$sleepiest['total']} Max @ $at Checksum $chk\n"; 

$guardsMinutes = array_map(function($guard){
    $max = max($guard['minutes']);
    $at = array_search($max, $guard['minutes']);
    $id = $guard['id'];
    $chk = $id * $at;
    $ans = "Guard $id at $at $max times - chk $chk\n";
    echo $ans;
    return [$guard['id'], $max, $at];
}, $guards);

$max = 0;
$ans = '';
$chk = 0;
foreach ($guardsMinutes as $gm){
    list($id, $most, $at) = $gm;
    if ($most > $max) {
        $chk = $id * $at;
        $ans = "Guard $id at $at $most times - chk $chk\n";
        $max = $most; 
    }
}

echo "\n\nPart 2 $ans\n\n";
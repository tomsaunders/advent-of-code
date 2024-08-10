#!/usr/bin/env php
<?php
$in = file_get_contents('input20.txt');
$test = <<<TST
#####
#.|.#
#-###
#.|X#
#####
TST;
$in = $test;
$lines = explode("\n", $in);

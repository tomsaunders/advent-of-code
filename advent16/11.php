<pre><?php
			//	$in    = file_get_contents('data/11.txt');
			//	$lines = explode("\n", $in);

			global $winState;
			global $knownStates;
			global $processing;

			$startElv = 1;
			$startState = [
				1 => ['PmG', 'PuG', 'RuM', 'RuG', 'CmM', 'CmG', 'CoM', 'CoG'],
				2 => ['PmM', 'PuM'],
				3 => [],
				4 => []
			];
			$win = [1 => [], 2 => [], 3 => [], 4 => ['PmG', 'PmM', 'PuG', 'PuM', 'RuM', 'RuG', 'CmM', 'CmG', 'CoM', 'CoG']];

			//part b additions
			// $startState[1] = array_merge($startState[1], ['ElM', 'ElG', 'DlM', 'DlG']);
			// $win[4] = array_merge($win[4], ['ElM', 'ElG', 'DlM', 'DlG']);


			//
			//	$startState = [
			//		1=> ['HyM', 'LiM'],
			//		2=> ['HyG'],
			//		3=> ['LiG'],
			//		4=> []
			//	];
			//	$win = [1=>[],2=>[], 3=>[], 4=>['HyM', 'LiM', 'HyG', 'LiG']];

			$winState = stateCode(4, $win);

			function stateCode($elv, $state)
			{
				$out = $elv . 'E';

				$idx = [];

				foreach ($state as $floor => $things) {
					foreach ($things as $thing) $idx[$thing] = $floor;
				}
				$pairs = [];
				foreach ($state as $floor => $items) {
					$chips = array_filter($items, function ($item) {
						return $item[2] == 'M';
					});
					foreach ($chips as $chip) {
						$gen = $chip;
						$gen[2] = 'G';
						$genF = $idx[$gen];
						$chpF = $idx[$chip];
						$pairs[] = [$chpF, $genF];
					}
				}
				usort($pairs, function ($a, $b) { //sort pairs by chip floor then gen floor
					if ($a[0] < $b[0]) return -1;
					if ($a[0] > $b[0]) return 1;

					if ($a[1] < $b[1]) return -1;
					if ($a[1] > $b[1]) return 1;
					return 0;
				});
				return $out . implode('-', array_map(function ($pair) {
					return implode(':', $pair);
				}, $pairs));
			}

			function makeMoves($elv, $state, $steps)
			{
				//		print_r(["Elevator $elv @ step $steps", $state]);

				global $winState;
				global $knownStates;
				global $processing;

				$current = stateCode($elv, $state);
				$c = count($processing);
				$s = count($knownStates);
				$m = round(memory_get_usage(1));
				if ($c % 100 == 0)
					echo "\nMove E $elv @ step $steps $current to process $c seen $s memory $m\n";

				if ($current == $winState) {
					echo "Reached win state after $steps steps\n";
					die();
				}

				if (isset($knownStates[$current])) {
					return; //already reached this point, so dont start another thread
				}
				$knownStates[$current] = true;

				$elvOptions = [];
				if ($elv == 1) $elvOptions[] = 2;
				else if ($elv == 4) $elvOptions = [3];
				else if ($elv == 2) {
					if (count($state[1])) $elvOptions[] = 1; //only bother to move down if theres stuff underneath
					$elvOptions[] = 3;
				} else if ($elv == 3) {
					if (count($state[1]) || count($state[2])) $elvOptions[] = 2; //only bother to move down if theres stuff underneath
					$elvOptions[] = 4;
				}

				$potentialItems = $state[$elv];
				$combos = getAllCombinations($potentialItems);

				//		print_r([
				//			'steps' => $steps,
				//			'current state' => $state,
				//			'elv' => $elv,
				//			'elvOptions' => $elvOptions,
				//			'combos' => $combos
				//		]);

				$steps++;

				foreach ($elvOptions as $eo) {
					foreach ($combos as $combo) {
						$newState = $state;
						$newState[$elv] = array_diff($newState[$elv], $combo);
						$newState[$eo] = array_merge($newState[$eo], $combo);

						$next = stateCode($eo, $newState);
						if (isValidState($newState)) {
							if (!isset($knownStates[$next])) {
								//						echo "Move to $eo take " . implode(', ', $combo) . " is valid, queuing\n";
								$processing[] = json_encode([$eo, $newState, $steps]);
							} else {
								//						echo "Move to $eo take " . implode(', ', $combo) . " has been SEEN, skipping\n";
							}
						} else {
							//					echo "Move to $eo take " . implode(', ', $combo) . " would be INVALID, skipping\n";
						}
					}
				}
			}

			function process()
			{
				global $processing;
				while (count($processing)) {
					set_time_limit(30);
					list($elv, $state, $steps) = json_decode(array_shift($processing), true);
					makeMoves($elv, $state, $steps);
				}
			}

			function getAllCombinations($items)
			{
				$combos = [];
				foreach ($items as $item) $combos[] = [$item]; //add single moves

				for ($a = 0; $a < count($items); $a++) {
					for ($b = $a + 1; $b < count($items); $b++) {
						$combos[] = [$items[$a], $items[$b]];
					}
				}

				return $combos;
			}

			function isValidState($state)
			{
				foreach ($state as $floor => $items) {
					$chips = array_filter($items, function ($item) {
						return $item[2] == 'M';
					});
					$gens = array_filter($items, function ($item) {
						return $item[2] == 'G';
					});

					foreach ($chips as $chip) {
						$gen = $chip;
						$gen[2] = 'G';
						if (in_array($gen, $gens) !== FALSE) {
							continue;		//this chip is safe as it is paired
						}
						if (count($gens)) {
							return FALSE; 	//this chip is fried because it's near a different generator
						}
					}
				}
				return TRUE;
			}

			$processing[] = json_encode([$startElv, $startState, 0]);
			ini_set('memory_limit', '2G');
			process();

			?></pre>
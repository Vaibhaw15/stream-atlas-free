"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Check,
  Bookmark,
  ChevronDown,
  ChevronRight,
  Code2,
  Lightbulb,
  Eye,
  EyeOff,
  Filter as FilterIcon,
  Layers,
  Hash,
  RotateCcw,
  Sparkles,
  Terminal,
  Copy,
} from "lucide-react";

const Q = [
  // ============ EASY: FILTER & MAP BASICS (1-20) ============
  {
    id: 1,
    title: "Filter even numbers",
    category: "Filter",
    difficulty: "Easy",
    problem: "Given a list of integers, return only the even numbers.",
    input: "List<Integer> nums = List.of(1, 2, 3, 4, 5, 6, 7, 8);",
    output: "[2, 4, 6, 8]",
    hint: "Use filter() with the modulo operator.",
    solution: `List<Integer> evens = nums.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());`,
    explanation:
      "filter() takes a Predicate and keeps only elements for which the predicate returns true.",
  },
  {
    id: 2,
    title: "Square each element",
    category: "Map",
    difficulty: "Easy",
    problem: "Square every number in the list.",
    input: "List<Integer> nums = List.of(1, 2, 3, 4, 5);",
    output: "[1, 4, 9, 16, 25]",
    hint: "Use map() to transform each element.",
    solution: `List<Integer> squares = nums.stream()
    .map(n -> n * n)
    .collect(Collectors.toList());`,
    explanation: "map() applies a Function to every element, producing a new stream.",
  },
  {
    id: 3,
    title: "Numbers greater than 10",
    category: "Filter",
    difficulty: "Easy",
    problem: "Filter out all numbers greater than 10.",
    input: "List<Integer> nums = List.of(5, 12, 8, 20, 3, 15);",
    output: "[12, 20, 15]",
    hint: "A simple filter with a comparison predicate.",
    solution: `List<Integer> result = nums.stream()
    .filter(n -> n > 10)
    .collect(Collectors.toList());`,
    explanation: "Predicate is just any boolean-returning lambda.",
  },
  {
    id: 4,
    title: "Convert all strings to uppercase",
    category: "Map",
    difficulty: "Easy",
    problem: "Transform every string to its uppercase version.",
    input: 'List<String> names = List.of("alice", "bob", "carol");',
    output: "[ALICE, BOB, CAROL]",
    hint: "map() + String::toUpperCase",
    solution: `List<String> upper = names.stream()
    .map(String::toUpperCase)
    .collect(Collectors.toList());`,
    explanation: "Method references like String::toUpperCase are cleaner than lambdas when applicable.",
  },
  {
    id: 5,
    title: "Length of each string",
    category: "Map",
    difficulty: "Easy",
    problem: "Get the character length of each string.",
    input: 'List<String> words = List.of("hi", "hello", "hey");',
    output: "[2, 5, 3]",
    hint: "Use map() with String::length.",
    solution: `List<Integer> lengths = words.stream()
    .map(String::length)
    .collect(Collectors.toList());`,
    explanation: "Method reference makes the intent unmistakable.",
  },
  {
    id: 6,
    title: "Strings starting with 'A'",
    category: "Filter",
    difficulty: "Easy",
    problem: "Keep only strings that start with 'A'.",
    input: 'List<String> names = List.of("Alice", "Bob", "Andrew", "Carol");',
    output: "[Alice, Andrew]",
    hint: "Use String::startsWith inside filter().",
    solution: `List<String> result = names.stream()
    .filter(s -> s.startsWith("A"))
    .collect(Collectors.toList());`,
    explanation: "Filter works with any boolean-returning method.",
  },
  {
    id: 7,
    title: "Remove null and empty strings",
    category: "Filter",
    difficulty: "Easy",
    problem: "Remove null entries and empty strings.",
    input: 'List<String> data = Arrays.asList("a", null, "", "b", " ", "c");',
    output: "[a, b, c]",
    hint: "Chain two filters or use one combined predicate.",
    solution: `List<String> clean = data.stream()
    .filter(Objects::nonNull)
    .filter(s -> !s.isBlank())
    .collect(Collectors.toList());`,
    explanation:
      "isBlank() (Java 11+) handles whitespace-only strings; isEmpty() only catches \"\".",
  },
  {
    id: 8,
    title: "Get distinct elements",
    category: "Filter",
    difficulty: "Easy",
    problem: "Return only unique elements, preserving order.",
    input: "List<Integer> nums = List.of(1, 2, 2, 3, 4, 4, 5);",
    output: "[1, 2, 3, 4, 5]",
    hint: "There's a built-in stream operation for this.",
    solution: `List<Integer> unique = nums.stream()
    .distinct()
    .collect(Collectors.toList());`,
    explanation: "distinct() relies on equals() to identify duplicates.",
  },
  {
    id: 9,
    title: "Skip first N elements",
    category: "Filter",
    difficulty: "Easy",
    problem: "Skip the first 3 elements of the list.",
    input: "List<Integer> nums = List.of(10, 20, 30, 40, 50);",
    output: "[40, 50]",
    hint: "Use skip(n).",
    solution: `List<Integer> result = nums.stream()
    .skip(3)
    .collect(Collectors.toList());`,
    explanation: "skip(n) discards the first n elements.",
  },
  {
    id: 10,
    title: "Take first N elements",
    category: "Filter",
    difficulty: "Easy",
    problem: "Get only the first 3 elements.",
    input: "List<Integer> nums = List.of(10, 20, 30, 40, 50);",
    output: "[10, 20, 30]",
    hint: "limit(n) truncates the stream.",
    solution: `List<Integer> result = nums.stream()
    .limit(3)
    .collect(Collectors.toList());`,
    explanation: "limit() is useful for paging and previews.",
  },
  {
    id: 11,
    title: "Count strings longer than 5",
    category: "Reduce",
    difficulty: "Easy",
    problem: "Count how many strings have length greater than 5.",
    input: 'List<String> words = List.of("apple", "banana", "kiwi", "strawberry");',
    output: "2",
    hint: "Filter then count().",
    solution: `long count = words.stream()
    .filter(w -> w.length() > 5)
    .count();`,
    explanation: "count() is a terminal operation returning a long.",
  },
  {
    id: 12,
    title: "Any element matches?",
    category: "Reduce",
    difficulty: "Easy",
    problem: "Check if any number is negative.",
    input: "List<Integer> nums = List.of(1, 2, -3, 4);",
    output: "true",
    hint: "anyMatch() short-circuits on first match.",
    solution: `boolean hasNegative = nums.stream()
    .anyMatch(n -> n < 0);`,
    explanation: "anyMatch returns as soon as one element satisfies the predicate.",
  },
  {
    id: 13,
    title: "All elements match?",
    category: "Reduce",
    difficulty: "Easy",
    problem: "Check if all numbers are positive.",
    input: "List<Integer> nums = List.of(1, 2, 3, 4);",
    output: "true",
    hint: "allMatch() short-circuits on first failure.",
    solution: `boolean allPositive = nums.stream()
    .allMatch(n -> n > 0);`,
    explanation: "Returns true on an empty stream (vacuous truth).",
  },
  {
    id: 14,
    title: "Find first matching element",
    category: "Reduce",
    difficulty: "Easy",
    problem: "Find the first number divisible by 7.",
    input: "List<Integer> nums = List.of(3, 8, 14, 21, 28);",
    output: "Optional[14]",
    hint: "filter() then findFirst().",
    solution: `Optional<Integer> first = nums.stream()
    .filter(n -> n % 7 == 0)
    .findFirst();`,
    explanation: "findFirst() returns Optional — handle the empty case.",
  },
  {
    id: 15,
    title: "Sum of all numbers",
    category: "Reduce",
    difficulty: "Easy",
    problem: "Sum every number in the list.",
    input: "List<Integer> nums = List.of(1, 2, 3, 4, 5);",
    output: "15",
    hint: "mapToInt then sum(), or reduce.",
    solution: `int sum = nums.stream()
    .mapToInt(Integer::intValue)
    .sum();`,
    explanation:
      "mapToInt produces an IntStream that exposes sum/avg/min/max directly — no boxing overhead.",
  },
  {
    id: 16,
    title: "Average of numbers",
    category: "Reduce",
    difficulty: "Easy",
    problem: "Compute the average of the list.",
    input: "List<Integer> nums = List.of(2, 4, 6, 8);",
    output: "5.0",
    hint: "IntStream.average() returns OptionalDouble.",
    solution: `double avg = nums.stream()
    .mapToInt(Integer::intValue)
    .average()
    .orElse(0.0);`,
    explanation: "average() returns OptionalDouble — handle the empty case explicitly.",
  },
  {
    id: 17,
    title: "Min and Max",
    category: "Reduce",
    difficulty: "Easy",
    problem: "Find the smallest and largest numbers.",
    input: "List<Integer> nums = List.of(7, 2, 9, 4, 6);",
    output: "min=2, max=9",
    hint: "IntStream.min() and IntStream.max().",
    solution: `IntSummaryStatistics stats = nums.stream()
    .mapToInt(Integer::intValue)
    .summaryStatistics();
int min = stats.getMin();
int max = stats.getMax();`,
    explanation:
      "summaryStatistics() bundles count, sum, min, avg, and max — efficient single-pass.",
  },
  {
    id: 18,
    title: "List of squares",
    category: "Map",
    difficulty: "Easy",
    problem: "Produce a list of squares of all numbers.",
    input: "List<Integer> nums = List.of(1, 2, 3, 4);",
    output: "[1, 4, 9, 16]",
    hint: "Pair map with toList().",
    solution: `List<Integer> squares = nums.stream()
    .map(n -> n * n)
    .toList();`,
    explanation: "Stream.toList() (Java 16+) is shorter than collect(Collectors.toList()).",
  },
  {
    id: 19,
    title: "Lowercase all strings",
    category: "Map",
    difficulty: "Easy",
    problem: "Convert all strings to lowercase.",
    input: 'List<String> names = List.of("ALICE", "BOB", "CAROL");',
    output: "[alice, bob, carol]",
    hint: "Method reference!",
    solution: `List<String> lower = names.stream()
    .map(String::toLowerCase)
    .toList();`,
    explanation: "Mirror of Q4 — same pattern, opposite transformation.",
  },
  {
    id: 20,
    title: "Numbers in a range",
    category: "Filter",
    difficulty: "Easy",
    problem: "Filter numbers between 10 and 50 (inclusive).",
    input: "List<Integer> nums = List.of(5, 15, 25, 60, 35, 75);",
    output: "[15, 25, 35]",
    hint: "Combine two conditions with &&.",
    solution: `List<Integer> result = nums.stream()
    .filter(n -> n >= 10 && n <= 50)
    .toList();`,
    explanation: "Compound predicates work directly inside filter.",
  },

  // ============ MEDIUM: SORTING & COLLECTORS (21-50) ============
  {
    id: 21,
    title: "Sort ascending",
    category: "Sort",
    difficulty: "Medium",
    problem: "Sort the list in ascending order.",
    input: "List<Integer> nums = List.of(5, 2, 8, 1, 9, 3);",
    output: "[1, 2, 3, 5, 8, 9]",
    hint: "Default sorted() uses natural ordering.",
    solution: `List<Integer> sorted = nums.stream()
    .sorted()
    .toList();`,
    explanation: "sorted() with no args uses Comparable's natural order.",
  },
  {
    id: 22,
    title: "Sort descending",
    category: "Sort",
    difficulty: "Medium",
    problem: "Sort the list in descending order.",
    input: "List<Integer> nums = List.of(5, 2, 8, 1, 9, 3);",
    output: "[9, 8, 5, 3, 2, 1]",
    hint: "Comparator.reverseOrder().",
    solution: `List<Integer> sorted = nums.stream()
    .sorted(Comparator.reverseOrder())
    .toList();`,
    explanation: "reverseOrder() flips natural ordering.",
  },
  {
    id: 23,
    title: "Sort strings by length",
    category: "Sort",
    difficulty: "Medium",
    problem: "Sort strings by length, shortest first.",
    input: 'List<String> words = List.of("banana", "fig", "kiwi", "apple");',
    output: "[fig, kiwi, apple, banana]",
    hint: "Comparator.comparingInt(String::length).",
    solution: `List<String> sorted = words.stream()
    .sorted(Comparator.comparingInt(String::length))
    .toList();`,
    explanation: "comparingInt avoids autoboxing compared to comparing.",
  },
  {
    id: 24,
    title: "Sort objects by field",
    category: "Sort",
    difficulty: "Medium",
    problem: "Sort employees by salary ascending.",
    input: "List<Employee> employees;  // each has name, salary",
    output: "Employees ordered low → high by salary",
    hint: "Comparator.comparing(getter).",
    solution: `List<Employee> sorted = employees.stream()
    .sorted(Comparator.comparingDouble(Employee::getSalary))
    .toList();`,
    explanation:
      "Use comparingDouble/Int/Long for primitives to avoid boxing in hot paths.",
  },
  {
    id: 25,
    title: "Sort by multiple fields",
    category: "Sort",
    difficulty: "Medium",
    problem: "Sort employees by department, then by salary descending within department.",
    input: "List<Employee> employees;",
    output: "Grouped by department, salary descending inside each group",
    hint: "Chain comparators using thenComparing().",
    solution: `List<Employee> sorted = employees.stream()
    .sorted(
        Comparator.comparing(Employee::getDepartment)
            .thenComparing(Comparator.comparingDouble(Employee::getSalary).reversed())
    )
    .toList();`,
    explanation:
      "thenComparing chains tiebreakers; reversed() flips just one segment.",
  },
  {
    id: 26,
    title: "Collect to List",
    category: "Collect",
    difficulty: "Medium",
    problem: "Collect filtered results into a list.",
    input: "List<Integer> nums = List.of(1, 2, 3, 4, 5);",
    output: "[2, 4]",
    hint: "Collectors.toList() or Stream.toList().",
    solution: `List<Integer> result = nums.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());`,
    explanation: "Returns a mutable List; for unmodifiable use toUnmodifiableList().",
  },
  {
    id: 27,
    title: "Collect to Set",
    category: "Collect",
    difficulty: "Medium",
    problem: "Collect distinct elements into a Set.",
    input: "List<Integer> nums = List.of(1, 2, 2, 3, 3, 3);",
    output: "{1, 2, 3}",
    hint: "Collectors.toSet().",
    solution: `Set<Integer> result = nums.stream()
    .collect(Collectors.toSet());`,
    explanation:
      "Set inherently de-duplicates; iteration order not guaranteed (use LinkedHashSet collector to preserve).",
  },
  {
    id: 28,
    title: "Collect to Map (id → object)",
    category: "Collect",
    difficulty: "Medium",
    problem: "Build a map from id to employee.",
    input: "List<Employee> employees;",
    output: "Map<Integer, Employee>",
    hint: "Collectors.toMap(keyFn, valueFn).",
    solution: `Map<Integer, Employee> byId = employees.stream()
    .collect(Collectors.toMap(Employee::getId, e -> e));`,
    explanation:
      "Function.identity() is idiomatic for the value mapper when you want the element itself.",
  },
  {
    id: 29,
    title: "toMap with merge function",
    category: "Collect",
    difficulty: "Medium",
    problem: "Sum amounts grouped by category id (handle duplicates).",
    input: "List<Transaction> txns;",
    output: "Map<String, Double>",
    hint: "Provide a third arg — the merge function — to toMap.",
    solution: `Map<String, Double> totals = txns.stream()
    .collect(Collectors.toMap(
        Transaction::getCategory,
        Transaction::getAmount,
        Double::sum
    ));`,
    explanation:
      "Without a merge fn, duplicate keys throw IllegalStateException.",
  },
  {
    id: 30,
    title: "Group by category",
    category: "GroupBy",
    difficulty: "Medium",
    problem: "Group employees by department.",
    input: "List<Employee> employees;",
    output: "Map<String, List<Employee>>",
    hint: "Collectors.groupingBy(classifier).",
    solution: `Map<String, List<Employee>> byDept = employees.stream()
    .collect(Collectors.groupingBy(Employee::getDepartment));`,
    explanation:
      "Default downstream collector is toList() — values are lists of grouped elements.",
  },
  {
    id: 31,
    title: "Count per group",
    category: "GroupBy",
    difficulty: "Medium",
    problem: "Count employees in each department.",
    input: "List<Employee> employees;",
    output: "Map<String, Long>",
    hint: "Use Collectors.counting() as the downstream collector.",
    solution: `Map<String, Long> counts = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::getDepartment,
        Collectors.counting()
    ));`,
    explanation: "Two-arg groupingBy lets you control what to do with each group.",
  },
  {
    id: 32,
    title: "Sum per group",
    category: "GroupBy",
    difficulty: "Medium",
    problem: "Total salary per department.",
    input: "List<Employee> employees;",
    output: "Map<String, Double>",
    hint: "Collectors.summingDouble.",
    solution: `Map<String, Double> totalSalary = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::getDepartment,
        Collectors.summingDouble(Employee::getSalary)
    ));`,
    explanation:
      "summingDouble adds up the mapped values — no manual reduction needed.",
  },
  {
    id: 33,
    title: "Average per group",
    category: "GroupBy",
    difficulty: "Medium",
    problem: "Average salary per department.",
    input: "List<Employee> employees;",
    output: "Map<String, Double>",
    hint: "Collectors.averagingDouble.",
    solution: `Map<String, Double> avgSalary = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::getDepartment,
        Collectors.averagingDouble(Employee::getSalary)
    ));`,
    explanation:
      "averagingDouble returns Double directly, not Optional — empty groups can't exist here.",
  },
  {
    id: 34,
    title: "Partition by predicate",
    category: "GroupBy",
    difficulty: "Medium",
    problem: "Split numbers into evens and odds.",
    input: "List<Integer> nums = List.of(1, 2, 3, 4, 5, 6);",
    output: "{true=[2,4,6], false=[1,3,5]}",
    hint: "Collectors.partitioningBy.",
    solution: `Map<Boolean, List<Integer>> parts = nums.stream()
    .collect(Collectors.partitioningBy(n -> n % 2 == 0));`,
    explanation:
      "partitioningBy is groupingBy specialized for boolean predicates — always returns both true/false keys.",
  },
  {
    id: 35,
    title: "Join strings with delimiter",
    category: "Collect",
    difficulty: "Medium",
    problem: "Join names with comma.",
    input: 'List<String> names = List.of("Alice", "Bob", "Carol");',
    output: '"Alice, Bob, Carol"',
    hint: "Collectors.joining(delimiter).",
    solution: `String joined = names.stream()
    .collect(Collectors.joining(", "));`,
    explanation: "joining also supports prefix/suffix overloads.",
  },
  {
    id: 36,
    title: "Top 3 elements",
    category: "Sort",
    difficulty: "Medium",
    problem: "Get the 3 largest numbers.",
    input: "List<Integer> nums = List.of(5, 12, 3, 18, 7, 25, 1);",
    output: "[25, 18, 12]",
    hint: "Sort descending, then limit(3).",
    solution: `List<Integer> top3 = nums.stream()
    .sorted(Comparator.reverseOrder())
    .limit(3)
    .toList();`,
    explanation:
      "For huge streams, prefer a bounded heap collector — full sort is O(n log n).",
  },
  {
    id: 37,
    title: "Bottom 3 elements",
    category: "Sort",
    difficulty: "Medium",
    problem: "Get the 3 smallest numbers.",
    input: "List<Integer> nums = List.of(5, 12, 3, 18, 7, 25, 1);",
    output: "[1, 3, 5]",
    hint: "Sort ascending, then limit(3).",
    solution: `List<Integer> bottom3 = nums.stream()
    .sorted()
    .limit(3)
    .toList();`,
    explanation: "Mirror of Q36.",
  },
  {
    id: 38,
    title: "Count occurrences of each character",
    category: "GroupBy",
    difficulty: "Medium",
    problem: "Count character frequency in a string.",
    input: 'String s = "programming";',
    output: "{p=1, r=2, o=1, g=2, a=1, m=2, i=1, n=1}",
    hint: "Stream chars then groupingBy + counting.",
    solution: `Map<Character, Long> freq = s.chars()
    .mapToObj(c -> (char) c)
    .collect(Collectors.groupingBy(
        Function.identity(),
        Collectors.counting()
    ));`,
    explanation:
      "String.chars() returns IntStream of code points — box explicitly to Character.",
  },
  {
    id: 39,
    title: "Word frequency",
    category: "GroupBy",
    difficulty: "Medium",
    problem: "Count occurrences of each word in a sentence.",
    input: 'String s = "the quick brown fox jumps over the lazy dog the";',
    output: "{the=3, quick=1, brown=1, ...}",
    hint: "Split on whitespace then groupingBy + counting.",
    solution: `Map<String, Long> wordCount = Arrays.stream(s.split("\\\\s+"))
    .collect(Collectors.groupingBy(
        Function.identity(),
        Collectors.counting()
    ));`,
    explanation: "Classic word-count idiom — same shape as Q38, different source.",
  },
  {
    id: 40,
    title: "Most frequent element",
    category: "GroupBy",
    difficulty: "Medium",
    problem: "Find the most frequent number.",
    input: "List<Integer> nums = List.of(1, 2, 2, 3, 3, 3, 4);",
    output: "3",
    hint: "Group + count, then take max by entry value.",
    solution: `Integer mostFrequent = nums.stream()
    .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))
    .entrySet().stream()
    .max(Map.Entry.comparingByValue())
    .map(Map.Entry::getKey)
    .orElseThrow();`,
    explanation:
      "Map.Entry.comparingByValue() is a tidy way to sort entry sets by their values.",
  },
  {
    id: 41,
    title: "FlatMap nested list",
    category: "FlatMap",
    difficulty: "Medium",
    problem: "Flatten a list of lists into a single list.",
    input: "List<List<Integer>> nested = List.of(List.of(1,2), List.of(3,4), List.of(5));",
    output: "[1, 2, 3, 4, 5]",
    hint: "flatMap with List::stream.",
    solution: `List<Integer> flat = nested.stream()
    .flatMap(List::stream)
    .toList();`,
    explanation:
      "flatMap unwraps one level of nesting — each input element produces zero or more output elements.",
  },
  {
    id: 42,
    title: "FlatMap split words",
    category: "FlatMap",
    difficulty: "Medium",
    problem: "From a list of sentences, get a flat list of all words.",
    input: 'List<String> sentences = List.of("hello world", "foo bar baz");',
    output: "[hello, world, foo, bar, baz]",
    hint: "Split each sentence and flatten.",
    solution: `List<String> words = sentences.stream()
    .flatMap(s -> Arrays.stream(s.split("\\\\s+")))
    .toList();`,
    explanation:
      "split() returns an array; Arrays.stream wraps it for flatMap to consume.",
  },
  {
    id: 43,
    title: "Concatenate streams",
    category: "FlatMap",
    difficulty: "Medium",
    problem: "Combine two lists into a single stream.",
    input: "List<Integer> a = List.of(1,2,3); List<Integer> b = List.of(4,5,6);",
    output: "[1, 2, 3, 4, 5, 6]",
    hint: "Stream.concat() takes exactly two streams.",
    solution: `List<Integer> combined = Stream.concat(a.stream(), b.stream())
    .toList();`,
    explanation:
      "For more than two, use Stream.of(a,b,c).flatMap(List::stream).",
  },
  {
    id: 44,
    title: "Find duplicates",
    category: "GroupBy",
    difficulty: "Medium",
    problem: "Return elements that appear more than once.",
    input: "List<Integer> nums = List.of(1,2,3,2,4,5,4,6);",
    output: "[2, 4]",
    hint: "Group + count, filter count > 1.",
    solution: `List<Integer> dupes = nums.stream()
    .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))
    .entrySet().stream()
    .filter(e -> e.getValue() > 1)
    .map(Map.Entry::getKey)
    .toList();`,
    explanation: "Stream the entrySet to filter and project the keys back out.",
  },
  {
    id: 45,
    title: "Remove duplicates preserving order",
    category: "Filter",
    difficulty: "Medium",
    problem: "Get unique elements in original encounter order.",
    input: "List<Integer> nums = List.of(3, 1, 2, 1, 3, 4, 2);",
    output: "[3, 1, 2, 4]",
    hint: "distinct() preserves encounter order on sequential streams.",
    solution: `List<Integer> unique = nums.stream()
    .distinct()
    .toList();`,
    explanation:
      "Order preservation is a guarantee for sequential streams; for parallel + ordered sources it's still preserved.",
  },
  {
    id: 46,
    title: "Common elements between lists",
    category: "Filter",
    difficulty: "Medium",
    problem: "Find elements present in both lists (intersection).",
    input: "List<Integer> a = List.of(1,2,3,4); List<Integer> b = List.of(3,4,5,6);",
    output: "[3, 4]",
    hint: "Filter a's stream by membership in b.",
    solution: `Set<Integer> bSet = new HashSet<>(b);
List<Integer> common = a.stream()
    .filter(bSet::contains)
    .toList();`,
    explanation:
      "Convert one side to a Set for O(1) lookup — calling b.contains() inside filter would be O(n*m).",
  },
  {
    id: 47,
    title: "Difference between lists",
    category: "Filter",
    difficulty: "Medium",
    problem: "Elements in list A but not in list B.",
    input: "List<Integer> a = List.of(1,2,3,4); List<Integer> b = List.of(3,4,5,6);",
    output: "[1, 2]",
    hint: "Negate the contains check.",
    solution: `Set<Integer> bSet = new HashSet<>(b);
List<Integer> diff = a.stream()
    .filter(x -> !bSet.contains(x))
    .toList();`,
    explanation: "Same setup as Q46 with negation.",
  },
  {
    id: 48,
    title: "Stream from array",
    category: "Map",
    difficulty: "Medium",
    problem: "Build a stream from a primitive int array and double each value.",
    input: "int[] arr = {1, 2, 3, 4, 5};",
    output: "[2, 4, 6, 8, 10]",
    hint: "Arrays.stream() returns IntStream for int[].",
    solution: `int[] doubled = Arrays.stream(arr)
    .map(n -> n * 2)
    .toArray();`,
    explanation:
      "IntStream is a specialized primitive stream — no boxing on the way through.",
  },
  {
    id: 49,
    title: "Reverse a list",
    category: "Sort",
    difficulty: "Medium",
    problem: "Reverse the order of a list using streams.",
    input: "List<Integer> nums = List.of(1, 2, 3, 4, 5);",
    output: "[5, 4, 3, 2, 1]",
    hint: "Stream by index from end to start.",
    solution: `List<Integer> reversed = IntStream.range(0, nums.size())
    .mapToObj(i -> nums.get(nums.size() - 1 - i))
    .toList();`,
    explanation:
      "Streams aren't naturally reversible — index-based mapping is the cleanest stream-only approach. Collections.reverse() is simpler if you can mutate.",
  },
  {
    id: 50,
    title: "First N Fibonacci numbers",
    category: "Map",
    difficulty: "Medium",
    problem: "Generate the first 10 Fibonacci numbers using streams.",
    input: "int n = 10;",
    output: "[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]",
    hint: "Stream.iterate with a 2-element array as state.",
    solution: `List<Integer> fib = Stream.iterate(
        new int[]{0, 1},
        arr -> new int[]{arr[1], arr[0] + arr[1]}
    )
    .limit(10)
    .map(arr -> arr[0])
    .toList();`,
    explanation:
      "iterate is an infinite stream — limit() bounds it. The 2-element array carries the rolling state.",
  },

  // ============ HARD: ADVANCED OPERATIONS (51-100) ============
  {
    id: 51,
    title: "Group by + count, sorted",
    category: "GroupBy",
    difficulty: "Hard",
    problem: "Count words per length, sorted by length ascending.",
    input: 'List<String> words = List.of("a","bb","ccc","dd","e","fff");',
    output: "{1=2, 2=2, 3=2}",
    hint: "Pass a TreeMap supplier to groupingBy.",
    solution: `Map<Integer, Long> result = words.stream()
    .collect(Collectors.groupingBy(
        String::length,
        TreeMap::new,
        Collectors.counting()
    ));`,
    explanation:
      "Three-arg groupingBy lets you choose the Map type — TreeMap gives sorted keys.",
  },
  {
    id: 52,
    title: "Group employees by department",
    category: "GroupBy",
    difficulty: "Hard",
    problem: "Get only employee names grouped by department.",
    input: "List<Employee> employees;",
    output: "Map<String, List<String>>",
    hint: "Use Collectors.mapping() as downstream.",
    solution: `Map<String, List<String>> namesByDept = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::getDepartment,
        Collectors.mapping(Employee::getName, Collectors.toList())
    ));`,
    explanation:
      "mapping() transforms elements before they hit the inner collector — like map() inside the group.",
  },
  {
    id: 53,
    title: "Highest paid per department",
    category: "GroupBy",
    difficulty: "Hard",
    problem: "Find the highest-paid employee in each department.",
    input: "List<Employee> employees;",
    output: "Map<String, Employee>",
    hint: "Use Collectors.maxBy with collectingAndThen to unwrap Optional.",
    solution: `Map<String, Employee> topPerDept = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::getDepartment,
        Collectors.collectingAndThen(
            Collectors.maxBy(Comparator.comparingDouble(Employee::getSalary)),
            Optional::get
        )
    ));`,
    explanation:
      "maxBy returns Optional; collectingAndThen lets you finish/transform the collector's result.",
  },
  {
    id: 54,
    title: "Group by multiple fields",
    category: "GroupBy",
    difficulty: "Hard",
    problem: "Group employees by department then by job title.",
    input: "List<Employee> employees;",
    output: "Map<String, Map<String, List<Employee>>>",
    hint: "Nested groupingBy.",
    solution: `Map<String, Map<String, List<Employee>>> nested = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::getDepartment,
        Collectors.groupingBy(Employee::getJobTitle)
    ));`,
    explanation:
      "groupingBy nests indefinitely — each level gets its own classifier.",
  },
  {
    id: 55,
    title: "Reduce with identity",
    category: "Reduce",
    difficulty: "Hard",
    problem: "Multiply all numbers using reduce.",
    input: "List<Integer> nums = List.of(1, 2, 3, 4, 5);",
    output: "120",
    hint: "Three-arg reduce with identity = 1.",
    solution: `int product = nums.stream()
    .reduce(1, (a, b) -> a * b);`,
    explanation:
      "Identity must be a no-op: a * 1 == a. With no identity, reduce returns Optional.",
  },
  {
    id: 56,
    title: "Find longest string",
    category: "Reduce",
    difficulty: "Hard",
    problem: "Find the longest string in a list.",
    input: 'List<String> words = List.of("apple", "banana", "fig", "strawberry");',
    output: "strawberry",
    hint: "max() with a length-based comparator.",
    solution: `Optional<String> longest = words.stream()
    .max(Comparator.comparingInt(String::length));`,
    explanation:
      "max with a Comparator works on any type — not just numbers.",
  },
  {
    id: 57,
    title: "Find shortest string",
    category: "Reduce",
    difficulty: "Hard",
    problem: "Find the shortest string.",
    input: 'List<String> words = List.of("apple", "fig", "banana");',
    output: "fig",
    hint: "Mirror of Q56 with min.",
    solution: `Optional<String> shortest = words.stream()
    .min(Comparator.comparingInt(String::length));`,
    explanation: "min and max are symmetric.",
  },
  {
    id: 58,
    title: "Concatenate all strings",
    category: "Reduce",
    difficulty: "Hard",
    problem: "Concatenate all strings without delimiter using reduce.",
    input: 'List<String> words = List.of("Java", "Stream", "API");',
    output: "JavaStreamAPI",
    hint: "reduce with empty string identity.",
    solution: `String result = words.stream()
    .reduce("", String::concat);`,
    explanation:
      "Works but creates many intermediate strings — joining() is faster for big lists.",
  },
  {
    id: 59,
    title: "Summary statistics",
    category: "Reduce",
    difficulty: "Hard",
    problem: "Get count, sum, avg, min, max in one pass.",
    input: "List<Integer> nums = List.of(2, 5, 7, 9, 11);",
    output: "IntSummaryStatistics{count=5, sum=34, min=2, avg=6.8, max=11}",
    hint: "Collectors.summarizingInt.",
    solution: `IntSummaryStatistics stats = nums.stream()
    .collect(Collectors.summarizingInt(Integer::intValue));`,
    explanation: "All stats computed in a single traversal.",
  },
  {
    id: 60,
    title: "Find second highest",
    category: "Sort",
    difficulty: "Hard",
    problem: "Find the second highest distinct number.",
    input: "List<Integer> nums = List.of(5, 12, 3, 12, 18, 7, 18);",
    output: "Optional[12]",
    hint: "Sort distinct desc, skip 1, find first.",
    solution: `Optional<Integer> secondHighest = nums.stream()
    .distinct()
    .sorted(Comparator.reverseOrder())
    .skip(1)
    .findFirst();`,
    explanation:
      "distinct() before sort to avoid double-counting the maximum.",
  },
  {
    id: 61,
    title: "Find Nth highest",
    category: "Sort",
    difficulty: "Hard",
    problem: "Find the Nth highest distinct number.",
    input: "List<Integer> nums; int n = 3;",
    output: "Optional<Integer>",
    hint: "Generalize Q60 — skip(n-1).",
    solution: `Optional<Integer> nthHighest = nums.stream()
    .distinct()
    .sorted(Comparator.reverseOrder())
    .skip(n - 1)
    .findFirst();`,
    explanation:
      "Returns Optional.empty() if there are fewer than n distinct values.",
  },
  {
    id: 62,
    title: "Even-indexed elements",
    category: "Map",
    difficulty: "Hard",
    problem: "Get elements at even indices (0, 2, 4, ...).",
    input: 'List<String> list = List.of("a","b","c","d","e","f");',
    output: "[a, c, e]",
    hint: "IntStream over indices, filter, map back.",
    solution: `List<String> result = IntStream.range(0, list.size())
    .filter(i -> i % 2 == 0)
    .mapToObj(list::get)
    .toList();`,
    explanation:
      "Streams have no concept of indices — IntStream.range is the standard workaround.",
  },
  {
    id: 63,
    title: "Pair consecutive elements",
    category: "Map",
    difficulty: "Hard",
    problem: "Create pairs of consecutive elements.",
    input: "List<Integer> nums = List.of(1, 2, 3, 4, 5);",
    output: "[(1,2), (2,3), (3,4), (4,5)]",
    hint: "IntStream over adjacent indices.",
    solution: `List<int[]> pairs = IntStream.range(0, nums.size() - 1)
    .mapToObj(i -> new int[]{nums.get(i), nums.get(i + 1)})
    .toList();`,
    explanation:
      "Range size-1 keeps the right neighbor in bounds.",
  },
  {
    id: 64,
    title: "Running sum",
    category: "Reduce",
    difficulty: "Hard",
    problem: "Compute running sum (prefix sums).",
    input: "List<Integer> nums = List.of(1, 2, 3, 4, 5);",
    output: "[1, 3, 6, 10, 15]",
    hint: "Stateful — index + sum up to i.",
    solution: `List<Integer> running = IntStream.range(0, nums.size())
    .mapToObj(i -> nums.subList(0, i + 1).stream()
        .mapToInt(Integer::intValue).sum())
    .toList();`,
    explanation:
      "Pure stream solution is O(n²); use a regular for-loop with accumulator for O(n).",
  },
  {
    id: 65,
    title: "Convert list to Map<Boolean, List>",
    category: "GroupBy",
    difficulty: "Hard",
    problem: "Partition employees into those above and below average salary.",
    input: "List<Employee> employees;",
    output: "Map<Boolean, List<Employee>>",
    hint: "Compute avg first, then partitioningBy.",
    solution: `double avg = employees.stream()
    .mapToDouble(Employee::getSalary)
    .average().orElse(0.0);

Map<Boolean, List<Employee>> split = employees.stream()
    .collect(Collectors.partitioningBy(e -> e.getSalary() > avg));`,
    explanation:
      "Two passes: compute the average, then partition. Single-pass would require a custom collector.",
  },
  {
    id: 66,
    title: "Invert a Map",
    category: "Collect",
    difficulty: "Hard",
    problem: "Swap a Map<String, Integer> to Map<Integer, String>.",
    input: 'Map<String, Integer> m = Map.of("a", 1, "b", 2, "c", 3);',
    output: "{1=a, 2=b, 3=c}",
    hint: "Stream entrySet → toMap with swapped key/value.",
    solution: `Map<Integer, String> inverted = m.entrySet().stream()
    .collect(Collectors.toMap(
        Map.Entry::getValue,
        Map.Entry::getKey
    ));`,
    explanation:
      "Throws if values aren't unique — add a merge function if needed.",
  },
  {
    id: 67,
    title: "Sort map by value",
    category: "Sort",
    difficulty: "Hard",
    problem: "Sort a Map<String, Integer> by value descending.",
    input: 'Map<String, Integer> scores = Map.of("a", 30, "b", 10, "c", 20);',
    output: "[(a,30), (c,20), (b,10)]",
    hint: "Stream entries, sort, collect to LinkedHashMap.",
    solution: `Map<String, Integer> sorted = scores.entrySet().stream()
    .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
    .collect(Collectors.toMap(
        Map.Entry::getKey,
        Map.Entry::getValue,
        (a, b) -> a,
        LinkedHashMap::new
    ));`,
    explanation:
      "Plain HashMap loses ordering — supply LinkedHashMap to preserve insertion order.",
  },
  {
    id: 68,
    title: "Top N entries from Map",
    category: "Sort",
    difficulty: "Hard",
    problem: "Get the top 3 entries with highest values.",
    input: "Map<String, Integer> scores;",
    output: "Top 3 entries by value",
    hint: "Sort by value desc, then limit.",
    solution: `List<Map.Entry<String, Integer>> top3 = scores.entrySet().stream()
    .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
    .limit(3)
    .toList();`,
    explanation: "Same pattern as Q36 — applied to map entries.",
  },
  {
    id: 69,
    title: "IntStream.range",
    category: "Map",
    difficulty: "Hard",
    problem: "Generate integers from 1 to 10.",
    input: "int start = 1, end = 11;",
    output: "[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]",
    hint: "IntStream.range is exclusive at end; rangeClosed is inclusive.",
    solution: `List<Integer> range = IntStream.range(1, 11)
    .boxed()
    .toList();`,
    explanation:
      "boxed() converts IntStream → Stream<Integer>. Or use rangeClosed(1, 10).",
  },
  {
    id: 70,
    title: "Sum of squares",
    category: "Reduce",
    difficulty: "Hard",
    problem: "Sum of squares of numbers from 1 to N.",
    input: "int n = 5;",
    output: "55",
    hint: "rangeClosed → map(square) → sum.",
    solution: `int sumSquares = IntStream.rangeClosed(1, n)
    .map(i -> i * i)
    .sum();`,
    explanation: "Equivalent to N(N+1)(2N+1)/6 mathematically.",
  },
  {
    id: 71,
    title: "Find prime numbers",
    category: "Filter",
    difficulty: "Hard",
    problem: "Find primes up to N.",
    input: "int n = 20;",
    output: "[2, 3, 5, 7, 11, 13, 17, 19]",
    hint: "Filter using a primality predicate.",
    solution: `List<Integer> primes = IntStream.rangeClosed(2, n)
    .filter(i -> IntStream.rangeClosed(2, (int) Math.sqrt(i))
        .allMatch(j -> i % j != 0))
    .boxed()
    .toList();`,
    explanation:
      "Trial division up to √i is enough — allMatch returns true vacuously for i=2 and i=3.",
  },
  {
    id: 72,
    title: "Convert list to CSV string",
    category: "Collect",
    difficulty: "Hard",
    problem: "Convert a list of integers to a comma-separated string.",
    input: "List<Integer> nums = List.of(1, 2, 3, 4, 5);",
    output: '"1,2,3,4,5"',
    hint: "Map to String, then joining.",
    solution: `String csv = nums.stream()
    .map(String::valueOf)
    .collect(Collectors.joining(","));`,
    explanation:
      "joining only operates on CharSequence — convert non-strings first.",
  },
  {
    id: 73,
    title: "Parse CSV to list",
    category: "Map",
    difficulty: "Hard",
    problem: "Convert a comma-separated string to a list of integers.",
    input: 'String csv = "1,2,3,4,5";',
    output: "[1, 2, 3, 4, 5]",
    hint: "split, stream, parseInt.",
    solution: `List<Integer> nums = Arrays.stream(csv.split(","))
    .map(String::trim)
    .map(Integer::parseInt)
    .toList();`,
    explanation:
      "trim() guards against whitespace — common in real CSVs.",
  },
  {
    id: 74,
    title: "Group transactions by year",
    category: "GroupBy",
    difficulty: "Hard",
    problem: "Group transactions by the year of their date.",
    input: "List<Transaction> txns;  // each has date (LocalDate)",
    output: "Map<Integer, List<Transaction>>",
    hint: "Group by date.getYear().",
    solution: `Map<Integer, List<Transaction>> byYear = txns.stream()
    .collect(Collectors.groupingBy(t -> t.getDate().getYear()));`,
    explanation:
      "Classifier is just a function — derived properties work as keys.",
  },
  {
    id: 75,
    title: "Total amount per customer",
    category: "GroupBy",
    difficulty: "Hard",
    problem: "Sum transaction amounts grouped by customer id.",
    input: "List<Transaction> txns;",
    output: "Map<String, Double>",
    hint: "groupingBy + summingDouble.",
    solution: `Map<String, Double> totals = txns.stream()
    .collect(Collectors.groupingBy(
        Transaction::getCustomerId,
        Collectors.summingDouble(Transaction::getAmount)
    ));`,
    explanation:
      "Equivalent to a SQL: SELECT customer_id, SUM(amount) GROUP BY customer_id.",
  },
  {
    id: 76,
    title: "Factorial using stream",
    category: "Reduce",
    difficulty: "Hard",
    problem: "Calculate N! using a stream.",
    input: "int n = 5;",
    output: "120",
    hint: "Range from 1 to N, then reduce by multiplication.",
    solution: `long factorial = LongStream.rangeClosed(1, n)
    .reduce(1L, (a, b) -> a * b);`,
    explanation:
      "Use LongStream — int factorial overflows quickly (13! > Integer.MAX_VALUE).",
  },
  {
    id: 77,
    title: "Common prefix of strings",
    category: "Reduce",
    difficulty: "Hard",
    problem: "Find the longest common prefix among a list of strings.",
    input: 'List<String> words = List.of("flower", "flow", "flight");',
    output: '"fl"',
    hint: "reduce by trimming to common prefix iteratively.",
    solution: `String prefix = words.stream()
    .reduce((a, b) -> {
        int i = 0;
        while (i < a.length() && i < b.length() && a.charAt(i) == b.charAt(i)) i++;
        return a.substring(0, i);
    })
    .orElse("");`,
    explanation:
      "Two-arg reduce returns Optional; merge function progressively shrinks the prefix.",
  },
  {
    id: 78,
    title: "Check palindrome list",
    category: "Reduce",
    difficulty: "Hard",
    problem: "Check if a list reads the same forwards and backwards.",
    input: "List<Integer> nums = List.of(1, 2, 3, 2, 1);",
    output: "true",
    hint: "Compare i-th with (n-1-i)-th using IntStream.",
    solution: `boolean palindrome = IntStream.range(0, nums.size() / 2)
    .allMatch(i -> nums.get(i).equals(nums.get(nums.size() - 1 - i)));`,
    explanation:
      "Only need to scan to the midpoint — allMatch short-circuits on first mismatch.",
  },
  {
    id: 79,
    title: "Group anagrams",
    category: "GroupBy",
    difficulty: "Hard",
    problem: "Group words that are anagrams of each other.",
    input: 'List<String> words = List.of("eat","tea","tan","ate","nat","bat");',
    output: "[[eat, tea, ate], [tan, nat], [bat]]",
    hint: "Group by sorted-character signature.",
    solution: `Map<String, List<String>> groups = words.stream()
    .collect(Collectors.groupingBy(w -> {
        char[] chars = w.toCharArray();
        Arrays.sort(chars);
        return new String(chars);
    }));`,
    explanation:
      "Anagrams share the same sorted character sequence — perfect classifier.",
  },
  {
    id: 80,
    title: "Salary above average",
    category: "Filter",
    difficulty: "Hard",
    problem: "Find employees earning above the company average.",
    input: "List<Employee> employees;",
    output: "List<Employee>",
    hint: "Compute avg, then filter.",
    solution: `double avg = employees.stream()
    .mapToDouble(Employee::getSalary)
    .average().orElse(0.0);

List<Employee> aboveAvg = employees.stream()
    .filter(e -> e.getSalary() > avg)
    .toList();`,
    explanation:
      "Two passes — single-pass would need a custom collector that retains all elements.",
  },
  {
    id: 81,
    title: "Department with most employees",
    category: "GroupBy",
    difficulty: "Hard",
    problem: "Find the department with the largest headcount.",
    input: "List<Employee> employees;",
    output: "Department name",
    hint: "Group by + count, then max by value.",
    solution: `String biggest = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::getDepartment,
        Collectors.counting()
    ))
    .entrySet().stream()
    .max(Map.Entry.comparingByValue())
    .map(Map.Entry::getKey)
    .orElseThrow();`,
    explanation: "Pattern: group → entrySet().stream() → max → key.",
  },
  {
    id: 82,
    title: "Average salary by job title",
    category: "GroupBy",
    difficulty: "Hard",
    problem: "Average salary grouped by job title.",
    input: "List<Employee> employees;",
    output: "Map<String, Double>",
    hint: "groupingBy + averagingDouble.",
    solution: `Map<String, Double> avgByTitle = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::getJobTitle,
        Collectors.averagingDouble(Employee::getSalary)
    ));`,
    explanation: "Symmetric to Q33 with a different classifier.",
  },
  {
    id: 83,
    title: "Top 3 paid employees",
    category: "Sort",
    difficulty: "Hard",
    problem: "Get the top 3 highest-paid employees.",
    input: "List<Employee> employees;",
    output: "List<Employee> (3 elements)",
    hint: "Sort by salary desc, limit 3.",
    solution: `List<Employee> top3 = employees.stream()
    .sorted(Comparator.comparingDouble(Employee::getSalary).reversed())
    .limit(3)
    .toList();`,
    explanation: "Standard top-N pattern.",
  },
  {
    id: 84,
    title: "Group by age bracket",
    category: "GroupBy",
    difficulty: "Hard",
    problem: "Group employees into Young (<30), Mid (30-50), Senior (>50).",
    input: "List<Employee> employees;",
    output: "Map<String, List<Employee>>",
    hint: "Classifier returns a String label.",
    solution: `Map<String, List<Employee>> byBracket = employees.stream()
    .collect(Collectors.groupingBy(e -> {
        int age = e.getAge();
        if (age < 30) return "Young";
        if (age <= 50) return "Mid";
        return "Senior";
    }));`,
    explanation:
      "Classifier can encode any bucketing logic — keep it readable.",
  },
  {
    id: 85,
    title: "Count employees per city",
    category: "GroupBy",
    difficulty: "Hard",
    problem: "Count employees grouped by city.",
    input: "List<Employee> employees;",
    output: "Map<String, Long>",
    hint: "Standard groupingBy + counting.",
    solution: `Map<String, Long> byCity = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::getCity,
        Collectors.counting()
    ));`,
    explanation: "Same shape as Q31, different classifier.",
  },
  {
    id: 86,
    title: "Employee with longest name",
    category: "Reduce",
    difficulty: "Hard",
    problem: "Find the employee whose name has the most characters.",
    input: "List<Employee> employees;",
    output: "Optional<Employee>",
    hint: "max by name length.",
    solution: `Optional<Employee> longest = employees.stream()
    .max(Comparator.comparingInt(e -> e.getName().length()));`,
    explanation:
      "Comparator.comparingInt accepts ToIntFunction — clean for derived properties.",
  },
  {
    id: 87,
    title: "Custom collector",
    category: "Collect",
    difficulty: "Hard",
    problem: "Build a custom collector that joins strings with separator and prefix/suffix.",
    input: 'List<String> items = List.of("a", "b", "c");',
    output: '"[a-b-c]"',
    hint: "Collectors.joining has 3-arg overload.",
    solution: `String result = items.stream()
    .collect(Collectors.joining("-", "[", "]"));`,
    explanation:
      "joining(delim, prefix, suffix) — covers most string-joining needs without writing a custom Collector.",
  },
  {
    id: 88,
    title: "Cumulative product",
    category: "Map",
    difficulty: "Hard",
    problem: "Compute cumulative product of numbers.",
    input: "List<Integer> nums = List.of(1, 2, 3, 4);",
    output: "[1, 2, 6, 24]",
    hint: "Index-based mapping with reduce on prefix.",
    solution: `List<Integer> cumProd = IntStream.range(0, nums.size())
    .mapToObj(i -> nums.subList(0, i + 1).stream()
        .reduce(1, (a, b) -> a * b))
    .toList();`,
    explanation:
      "Pure-stream solution is O(n²); for O(n) use a mutable accumulator.",
  },
  {
    id: 89,
    title: "Find missing number",
    category: "Reduce",
    difficulty: "Hard",
    problem: "Find the missing number from 1 to N (one missing).",
    input: "List<Integer> nums = List.of(1, 2, 4, 5);  // missing 3, n=5",
    output: "3",
    hint: "Sum 1..N and subtract actual sum.",
    solution: `int n = 5;
int expected = IntStream.rangeClosed(1, n).sum();
int actual = nums.stream().mapToInt(Integer::intValue).sum();
int missing = expected - actual;`,
    explanation:
      "Mathematical trick — O(n) and constant memory.",
  },
  {
    id: 90,
    title: "Reverse words in sentence",
    category: "FlatMap",
    difficulty: "Hard",
    problem: "Reverse the order of words in a sentence using streams.",
    input: 'String s = "Java Stream API is powerful";',
    output: '"powerful is API Stream Java"',
    hint: "Split, stream from end, join.",
    solution: `String[] parts = s.split("\\\\s+");
String reversed = IntStream.range(0, parts.length)
    .mapToObj(i -> parts[parts.length - 1 - i])
    .collect(Collectors.joining(" "));`,
    explanation:
      "Index reversal pattern (Q49) + joining.",
  },
  {
    id: 91,
    title: "Frequency map sorted by frequency",
    category: "Sort",
    difficulty: "Hard",
    problem: "Build a word frequency map sorted by frequency desc.",
    input: 'String s = "the quick brown fox the lazy dog the";',
    output: "{the=3, quick=1, brown=1, ...}",
    hint: "Combine word frequency with map sorting.",
    solution: `Map<String, Long> freq = Arrays.stream(s.split("\\\\s+"))
    .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))
    .entrySet().stream()
    .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
    .collect(Collectors.toMap(
        Map.Entry::getKey,
        Map.Entry::getValue,
        (a, b) -> a,
        LinkedHashMap::new
    ));`,
    explanation:
      "Two-stage pipeline: build frequencies, then re-collect sorted into LinkedHashMap to preserve order.",
  },
  {
    id: 92,
    title: "Filter and transform together",
    category: "Map",
    difficulty: "Hard",
    problem: "Get squares of even numbers only.",
    input: "List<Integer> nums = List.of(1, 2, 3, 4, 5, 6);",
    output: "[4, 16, 36]",
    hint: "Order matters — filter first, then map.",
    solution: `List<Integer> result = nums.stream()
    .filter(n -> n % 2 == 0)
    .map(n -> n * n)
    .toList();`,
    explanation:
      "Filter early to reduce the working set before more expensive ops.",
  },
  {
    id: 93,
    title: "Convert list to Map<K, List<V>>",
    category: "GroupBy",
    difficulty: "Hard",
    problem: "Group strings by their first letter.",
    input: 'List<String> words = List.of("apple","ant","banana","berry","cherry");',
    output: "{a=[apple,ant], b=[banana,berry], c=[cherry]}",
    hint: "Classifier returns first character.",
    solution: `Map<Character, List<String>> byLetter = words.stream()
    .collect(Collectors.groupingBy(w -> w.charAt(0)));`,
    explanation: "Char keys work just like any other.",
  },
  {
    id: 94,
    title: "Count vowels in string",
    category: "Filter",
    difficulty: "Hard",
    problem: "Count vowels in a string using streams.",
    input: 'String s = "programming";',
    output: "3",
    hint: "Stream chars, filter vowels, count.",
    solution: `long vowels = s.toLowerCase().chars()
    .filter(c -> "aeiou".indexOf(c) >= 0)
    .count();`,
    explanation:
      "indexOf returns -1 if not found — convenient one-liner check.",
  },
  {
    id: 95,
    title: "Stream of random numbers",
    category: "Map",
    difficulty: "Hard",
    problem: "Generate 10 random integers between 1 and 100.",
    input: "// no input",
    output: "10 random ints in [1, 100]",
    hint: "Random.ints() returns an IntStream.",
    solution: `List<Integer> randoms = new Random().ints(10, 1, 101)
    .boxed()
    .toList();`,
    explanation:
      "Random.ints(streamSize, origin, bound) — bound is exclusive.",
  },
  {
    id: 96,
    title: "Two highest unique values",
    category: "Sort",
    difficulty: "Hard",
    problem: "Get the top 2 unique values in descending order.",
    input: "List<Integer> nums = List.of(5, 5, 12, 3, 12, 18);",
    output: "[18, 12]",
    hint: "distinct → sort desc → limit 2.",
    solution: `List<Integer> top2 = nums.stream()
    .distinct()
    .sorted(Comparator.reverseOrder())
    .limit(2)
    .toList();`,
    explanation: "distinct() prevents counting duplicates as separate ranks.",
  },
  {
    id: 97,
    title: "Group employees, sum and count",
    category: "GroupBy",
    difficulty: "Hard",
    problem: "For each department, get both the count and total salary.",
    input: "List<Employee> employees;",
    output: "Map<String, double[]>  // [count, sum]",
    hint: "Use teeing collector (Java 12+).",
    solution: `Map<String, double[]> stats = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::getDepartment,
        Collectors.teeing(
            Collectors.counting(),
            Collectors.summingDouble(Employee::getSalary),
            (count, sum) -> new double[]{count, sum}
        )
    ));`,
    explanation:
      "teeing runs two collectors in parallel and merges with a BiFunction — perfect for combined aggregates.",
  },
  {
    id: 98,
    title: "Stream of Map entries",
    category: "Collect",
    difficulty: "Hard",
    problem: "Convert a Map to a formatted string of key=value pairs.",
    input: 'Map<String, Integer> m = Map.of("a", 1, "b", 2, "c", 3);',
    output: '"a=1, b=2, c=3"',
    hint: "Stream entries, map to string, join.",
    solution: `String result = m.entrySet().stream()
    .map(e -> e.getKey() + "=" + e.getValue())
    .collect(Collectors.joining(", "));`,
    explanation:
      "Order isn't guaranteed unless the source map preserves it.",
  },
  {
    id: 99,
    title: "Find unique characters",
    category: "Filter",
    difficulty: "Hard",
    problem: "Get all unique characters in a string, in order.",
    input: 'String s = "programming";',
    output: "[p, r, o, g, a, m, i, n]",
    hint: "Stream chars, distinct, collect.",
    solution: `List<Character> unique = s.chars()
    .distinct()
    .mapToObj(c -> (char) c)
    .toList();`,
    explanation:
      "distinct on IntStream is faster than on Stream<Character> — defer boxing till after.",
  },
  {
    id: 100,
    title: "Real-world: Sales report",
    category: "GroupBy",
    difficulty: "Hard",
    problem:
      "From a list of Sale(product, region, amount), build: total amount per region, sorted by region, with each region containing a sub-map of total per product.",
    input: "List<Sale> sales;",
    output: "TreeMap<String, Map<String, Double>>",
    hint: "Nested groupingBy with TreeMap supplier.",
    solution: `Map<String, Map<String, Double>> report = sales.stream()
    .collect(Collectors.groupingBy(
        Sale::getRegion,
        TreeMap::new,
        Collectors.groupingBy(
            Sale::getProduct,
            Collectors.summingDouble(Sale::getAmount)
        )
    ));`,
    explanation:
      "Three-level pipeline: outer group by region (sorted), inner group by product, inner-inner sum amounts. This is the kind of question that tests whether you really understand collector composition.",
  },
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const CATEGORIES = [
  "Filter",
  "Map",
  "Sort",
  "Reduce",
  "Collect",
  "GroupBy",
  "FlatMap",
];

const DIFFICULTY_STYLES = {
  Easy: { bg: "rgba(132, 204, 22, 0.12)", color: "#a3e635", border: "rgba(132, 204, 22, 0.25)" },
  Medium: { bg: "rgba(251, 191, 36, 0.12)", color: "#fbbf24", border: "rgba(251, 191, 36, 0.3)" },
  Hard: { bg: "rgba(239, 68, 68, 0.12)", color: "#fca5a5", border: "rgba(239, 68, 68, 0.3)" },
};

// ===== Java starter code generation =====

const EMPLOYEE_CLASS = `class Employee {
    int id; String name, department, jobTitle, city; double salary; int age;
    public Employee(int id, String name, String department, String jobTitle, String city, double salary, int age) {
        this.id=id; this.name=name; this.department=department; this.jobTitle=jobTitle; this.city=city; this.salary=salary; this.age=age;
    }
    public int getId() { return id; }
    public String getName() { return name; }
    public String getDepartment() { return department; }
    public String getJobTitle() { return jobTitle; }
    public String getCity() { return city; }
    public double getSalary() { return salary; }
    public int getAge() { return age; }
    public String toString() { return name + "(" + department + ", $" + salary + ")"; }
}`;

const EMPLOYEE_DATA = `List<Employee> employees = List.of(
            new Employee(1, "Alice", "Engineering", "Manager", "NYC", 95000, 35),
            new Employee(2, "Bob", "Engineering", "Developer", "NYC", 75000, 28),
            new Employee(3, "Carol", "Sales", "Manager", "LA", 90000, 42),
            new Employee(4, "Dave", "Sales", "Rep", "LA", 65000, 31),
            new Employee(5, "Eve", "Engineering", "Developer", "SF", 80000, 25),
            new Employee(6, "Frank", "HR", "Manager", "NYC", 70000, 50)
        );`;

const TRANSACTION_CLASS = `class Transaction {
    String id, customerId, category;
    double amount;
    java.time.LocalDate date;
    public Transaction(String id, String customerId, String category, double amount, String dateStr) {
        this.id=id; this.customerId=customerId; this.category=category; this.amount=amount;
        this.date = java.time.LocalDate.parse(dateStr);
    }
    public String getId() { return id; }
    public String getCustomerId() { return customerId; }
    public String getCategory() { return category; }
    public double getAmount() { return amount; }
    public java.time.LocalDate getDate() { return date; }
    public String toString() { return id + "(" + customerId + "," + category + ",$" + amount + ")"; }
}`;

const TRANSACTION_DATA = `List<Transaction> txns = List.of(
            new Transaction("t1", "C001", "Food",   50.0, "2023-01-15"),
            new Transaction("t2", "C001", "Travel", 200.0, "2023-02-10"),
            new Transaction("t3", "C002", "Food",   30.0, "2024-03-05"),
            new Transaction("t4", "C001", "Food",   75.0, "2024-04-20"),
            new Transaction("t5", "C003", "Travel", 500.0, "2023-05-15"),
            new Transaction("t6", "C002", "Books",  25.0, "2024-06-01")
        );`;

const SALE_CLASS = `class Sale {
    String product, region;
    double amount;
    public Sale(String product, String region, double amount) {
        this.product=product; this.region=region; this.amount=amount;
    }
    public String getProduct() { return product; }
    public String getRegion() { return region; }
    public double getAmount() { return amount; }
}`;

const SALE_DATA = `List<Sale> sales = List.of(
            new Sale("Widget",  "North", 100.0),
            new Sale("Gadget",  "North", 200.0),
            new Sale("Widget",  "South", 150.0),
            new Sale("Doohickey","South", 75.0),
            new Sale("Gadget",  "East",  300.0),
            new Sale("Widget",  "East",  120.0)
        );`;

function buildStarter(q, includeSolution = false) {
  const text = q.input + " " + q.solution + " " + q.problem;
  const usesEmployee = /\bEmployee\b/.test(text);
  const usesTransaction = /\bTransaction\b/.test(text);
  const usesSale = /\bSale\b/.test(text);

  let classDefs = "";
  if (usesEmployee) classDefs += EMPLOYEE_CLASS + "\n\n";
  if (usesTransaction) classDefs += TRANSACTION_CLASS + "\n\n";
  if (usesSale) classDefs += SALE_CLASS + "\n\n";

  // Decide on data setup. If input is just a declaration, swap in real sample data.
  let dataSetup = q.input;
  const inputHasNoData = !/=\s*(List\.of|Arrays\.asList|new |Map\.of|".*")/.test(q.input);

  if (usesEmployee && inputHasNoData && /\bemployees\b/.test(q.input)) {
    dataSetup = EMPLOYEE_DATA;
  } else if (usesTransaction && inputHasNoData && /\btxns\b/.test(q.input)) {
    dataSetup = TRANSACTION_DATA;
  } else if (usesSale && inputHasNoData && /\bsales\b/.test(q.input)) {
    dataSetup = SALE_DATA;
  }

  const body = includeSolution
    ? q.solution
        .split("\n")
        .map((line, i) => (i === 0 ? line : "        " + line))
        .join("\n") +
      "\n        \n        // Print your result:\n        // System.out.println(...);"
    : "// Write your stream solution here\n        \n        \n        // Print your result with: System.out.println(...);";

  return `import java.util.*;
import java.util.stream.*;
import java.util.function.*;

${classDefs}public class Main {
    public static void main(String[] args) {
        ${dataSetup}

        ${body}
    }
}
`;
}

// Free version: code is copied to clipboard so you can run it in your own IDE / JShell.
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export default function StreamPracticeApp() {
  const [activeId, setActiveId] = useState(1);
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState(null);
  const [catFilter, setCatFilter] = useState(null);
  const [completed, setCompleted] = useState(new Set());
  const [bookmarked, setBookmarked] = useState(new Set());
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);
  const [showOnlyIncomplete, setShowOnlyIncomplete] = useState(false);
  const [revealed, setRevealed] = useState({}); // {qid: {hint:bool, solution:bool}}
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loaded, setLoaded] = useState(false);

  // Editor state — keyed by question id
  const [editorCodes, setEditorCodes] = useState({}); // {qid: code}
  const [copied, setCopied] = useState(false);

  // Load persisted state from localStorage
  useEffect(() => {
    try {
      const c = localStorage.getItem("completed");
      if (c) setCompleted(new Set(JSON.parse(c)));
    } catch {}
    try {
      const b = localStorage.getItem("bookmarked");
      if (b) setBookmarked(new Set(JSON.parse(b)));
    } catch {}
    try {
      const a = localStorage.getItem("activeId");
      if (a) setActiveId(parseInt(a, 10));
    } catch {}
    try {
      const ec = localStorage.getItem("editorCodes");
      if (ec) setEditorCodes(JSON.parse(ec));
    } catch {}
    setLoaded(true);
  }, []);

  // Persist state
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem("completed", JSON.stringify([...completed]));
    } catch {}
  }, [completed, loaded]);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem("bookmarked", JSON.stringify([...bookmarked]));
    } catch {}
  }, [bookmarked, loaded]);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem("activeId", String(activeId));
    } catch {}
  }, [activeId, loaded]);

  // Persist editor codes (debounced)
  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem("editorCodes", JSON.stringify(editorCodes));
      } catch {}
    }, 800);
    return () => clearTimeout(timer);
  }, [editorCodes, loaded]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return Q.filter((q) => {
      if (diffFilter && q.difficulty !== diffFilter) return false;
      if (catFilter && q.category !== catFilter) return false;
      if (showOnlyBookmarked && !bookmarked.has(q.id)) return false;
      if (showOnlyIncomplete && completed.has(q.id)) return false;
      if (
        term &&
        !q.title.toLowerCase().includes(term) &&
        !q.problem.toLowerCase().includes(term) &&
        !q.category.toLowerCase().includes(term)
      )
        return false;
      return true;
    });
  }, [search, diffFilter, catFilter, showOnlyBookmarked, showOnlyIncomplete, bookmarked, completed]);

  const active = useMemo(() => Q.find((q) => q.id === activeId) || Q[0], [activeId]);
  const activeReveal = revealed[activeId] || { hint: false, solution: false };
  const progress = Math.round((completed.size / Q.length) * 100);

  const toggleCompleted = (id) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleBookmark = (id) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const setReveal = (kind, val) => {
    setRevealed((prev) => ({
      ...prev,
      [activeId]: { ...(prev[activeId] || {}), [kind]: val },
    }));
  };

  const goNext = () => {
    const i = filtered.findIndex((q) => q.id === activeId);
    const next = filtered[(i + 1) % filtered.length];
    if (next) setActiveId(next.id);
  };
  const goPrev = () => {
    const i = filtered.findIndex((q) => q.id === activeId);
    const next = filtered[(i - 1 + filtered.length) % filtered.length];
    if (next) setActiveId(next.id);
  };

  const resetProgress = () => {
    if (confirm("Reset all progress, bookmarks, and editor code?")) {
      setCompleted(new Set());
      setBookmarked(new Set());
      setRevealed({});
      setEditorCodes({});
    }
  };

  // Editor helpers
  const activeCode =
    editorCodes[activeId] !== undefined ? editorCodes[activeId] : buildStarter(active);

  const updateCode = (val) => {
    setEditorCodes((prev) => ({ ...prev, [activeId]: val }));
  };

  const handleEditorKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.target;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newValue = ta.value.substring(0, start) + "    " + ta.value.substring(end);
      updateCode(newValue);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 4;
      });
    }
  };

  const handleResetCode = () => {
    setEditorCodes((prev) => {
      const next = { ...prev };
      delete next[activeId];
      return next;
    });
  };

  const handleLoadSolution = () => {
    setEditorCodes((prev) => ({ ...prev, [activeId]: buildStarter(active, true) }));
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(activeCode);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const styles = {
    root: {
      "--bg": "#0a0a0b",
      "--surface": "#131316",
      "--surface-2": "#1a1a1f",
      "--border": "rgba(255,255,255,0.08)",
      "--border-strong": "rgba(255,255,255,0.14)",
      "--text": "#ededee",
      "--text-dim": "#8a8a93",
      "--text-faint": "#5a5a63",
      "--accent": "#fbbf24",
      "--accent-dim": "rgba(251, 191, 36, 0.12)",
      "--accent-strong": "rgba(251, 191, 36, 0.25)",
      "--success": "#a3e635",
      minHeight: "100vh",
      background: "var(--bg)",
      color: "var(--text)",
      fontFamily: "'Geist', 'DM Sans', -apple-system, sans-serif",
      fontSize: "14px",
      lineHeight: "1.55",
      letterSpacing: "-0.005em",
    },
  };

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.16); }
        .pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 5px 11px; border-radius: 999px;
          font-size: 12px; font-weight: 500;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-dim);
          cursor: pointer; transition: all 0.15s ease;
          font-family: inherit; white-space: nowrap;
        }
        .pill:hover { color: var(--text); border-color: var(--border-strong); }
        .pill.active {
          background: var(--accent-dim);
          color: var(--accent);
          border-color: var(--accent-strong);
        }
        .btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 14px; border-radius: 8px;
          font-size: 13px; font-weight: 500;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text);
          cursor: pointer; transition: all 0.15s ease;
          font-family: inherit;
        }
        .btn:hover { background: var(--surface-2); border-color: var(--border-strong); }
        .btn-primary {
          background: var(--accent);
          color: #1a1a0a;
          border-color: var(--accent);
          font-weight: 600;
        }
        .btn-primary:hover { background: #fcd34d; }
        .btn-ghost {
          background: transparent;
          border-color: transparent;
          color: var(--text-dim);
          padding: 6px 10px;
        }
        .btn-ghost:hover {
          background: var(--surface);
          color: var(--text);
        }
        .q-row {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 11px 14px; border-radius: 8px;
          cursor: pointer; transition: background 0.12s ease;
          border: 1px solid transparent;
        }
        .q-row:hover { background: var(--surface); }
        .q-row.active {
          background: var(--surface-2);
          border-color: var(--border);
        }
        .check-box {
          width: 18px; height: 18px; min-width: 18px;
          border-radius: 5px; border: 1.5px solid var(--border-strong);
          display: flex; align-items: center; justify-content: center;
          margin-top: 2px;
          background: transparent;
          cursor: pointer; transition: all 0.15s ease;
        }
        .check-box:hover { border-color: var(--accent); }
        .check-box.done { background: var(--success); border-color: var(--success); }
        .bookmark-btn {
          background: transparent; border: none; cursor: pointer;
          padding: 4px; color: var(--text-faint);
          display: flex; align-items: center;
          transition: color 0.15s ease;
        }
        .bookmark-btn:hover { color: var(--accent); }
        .bookmark-btn.on { color: var(--accent); }
        .code-block {
          background: #0d0d0f;
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 18px 20px;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 13px;
          line-height: 1.65;
          overflow-x: auto;
          color: #e4e4e7;
        }
        .code-block .kw { color: #fbbf24; }
        .label {
          font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: var(--text-faint);
          margin-bottom: 8px;
        }
        .reveal-card {
          border: 1px dashed var(--border-strong);
          border-radius: 10px;
          padding: 18px 20px;
          background: rgba(251, 191, 36, 0.025);
          text-align: center;
          color: var(--text-dim);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .reveal-card:hover {
          background: rgba(251, 191, 36, 0.05);
          border-color: var(--accent-strong);
          color: var(--accent);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.25s ease; }
        .editor-shell {
          background: #0d0d0f;
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .editor-shell:focus-within {
          border-color: var(--accent-strong);
        }
        .editor-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          border-bottom: 1px solid var(--border);
          background: rgba(255,255,255,0.015);
          font-size: 12px;
          color: var(--text-faint);
          font-family: 'JetBrains Mono', monospace;
        }
        .editor-toolbar-actions { display: flex; gap: 6px; align-items: center; }
        .editor-textarea {
          width: 100%;
          border: none;
          background: transparent;
          color: #e4e4e7;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 13px;
          line-height: 1.65;
          padding: 16px 18px;
          outline: none;
          resize: vertical;
          min-height: 280px;
          tab-size: 4;
          -moz-tab-size: 4;
          display: block;
        }
        .editor-textarea::selection { background: rgba(251, 191, 36, 0.25); }
        .run-btn {
          background: var(--accent);
          color: #1a1a0a;
          border: none;
          padding: 7px 14px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: inherit;
          transition: all 0.15s ease;
        }
        .run-btn:hover { background: #fcd34d; }
        .run-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .icon-btn {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-dim);
          width: 28px; height: 28px;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }
        .icon-btn:hover {
          color: var(--text);
          border-color: var(--border-strong);
          background: var(--surface);
        }
        .output-panel {
          margin-top: 12px;
          border-radius: 10px;
          border: 1px solid var(--border);
          overflow: hidden;
          background: #0a0a0c;
        }
        .output-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          border-bottom: 1px solid var(--border);
          font-family: 'JetBrains Mono', monospace;
        }
        .output-body {
          padding: 14px 18px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12.5px;
          line-height: 1.6;
          white-space: pre-wrap;
          word-break: break-word;
          max-height: 320px;
          overflow-y: auto;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spin { animation: spin 1s linear infinite; }
      `}</style>

      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "20px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
          background: "var(--bg)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          backdropFilter: "blur(8px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 9,
              background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1a1a0a",
            }}
          >
            <Layers size={20} strokeWidth={2.4} />
          </div>
          <div>
            <h1
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 26,
                fontWeight: 400,
                fontStyle: "italic",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Stream <span style={{ color: "var(--accent)" }}>Atlas</span>
            </h1>
            <p
              style={{
                margin: "2px 0 0",
                fontSize: 12,
                color: "var(--text-dim)",
                letterSpacing: "0.02em",
              }}
            >
              100 Java Stream interview questions · curated practice
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ minWidth: 200 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                color: "var(--text-dim)",
                marginBottom: 6,
                fontWeight: 500,
                letterSpacing: "0.04em",
              }}
            >
              <span>PROGRESS</span>
              <span style={{ color: "var(--text)" }}>
                {completed.size}<span style={{ color: "var(--text-faint)" }}> / {Q.length}</span>
              </span>
            </div>
            <div
              style={{
                height: 4,
                background: "var(--surface-2)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #a3e635, #fbbf24)",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
          <button
            className="btn-ghost btn"
            onClick={resetProgress}
            title="Reset all progress"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </header>

      {/* Filter Bar */}
      <div
        style={{
          padding: "16px 28px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "8px 12px",
            flex: "1 1 240px",
            maxWidth: 360,
          }}
        >
          <Search size={15} color="var(--text-faint)" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text)",
              flex: 1,
              fontSize: 13,
              fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              className={`pill ${diffFilter === d ? "active" : ""}`}
              onClick={() => setDiffFilter(diffFilter === d ? null : d)}
            >
              {d}
            </button>
          ))}
        </div>

        <div
          style={{
            width: 1,
            height: 20,
            background: "var(--border)",
          }}
        />

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`pill ${catFilter === c ? "active" : ""}`}
              onClick={() => setCatFilter(catFilter === c ? null : c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        <button
          className={`pill ${showOnlyBookmarked ? "active" : ""}`}
          onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
        >
          <Bookmark size={12} />
          Bookmarked
        </button>
        <button
          className={`pill ${showOnlyIncomplete ? "active" : ""}`}
          onClick={() => setShowOnlyIncomplete(!showOnlyIncomplete)}
        >
          Incomplete only
        </button>
      </div>

      {/* Body */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: sidebarOpen ? "340px 1fr" : "0 1fr",
          minHeight: "calc(100vh - 145px)",
          transition: "grid-template-columns 0.25s ease",
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            borderRight: "1px solid var(--border)",
            overflow: "hidden",
            display: sidebarOpen ? "flex" : "none",
            flexDirection: "column",
            maxHeight: "calc(100vh - 145px)",
          }}
        >
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid var(--border)",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--text-faint)",
              letterSpacing: "0.08em",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>QUESTIONS</span>
            <span style={{ color: "var(--text-dim)" }}>{filtered.length}</span>
          </div>
          <div style={{ overflowY: "auto", flex: 1, padding: "10px 12px" }}>
            {filtered.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  color: "var(--text-faint)",
                  padding: "40px 20px",
                  fontSize: 13,
                }}
              >
                No questions match these filters.
              </div>
            )}
            {filtered.map((q) => {
              const isActive = q.id === activeId;
              const isDone = completed.has(q.id);
              const isBookmarked = bookmarked.has(q.id);
              return (
                <div
                  key={q.id}
                  className={`q-row ${isActive ? "active" : ""}`}
                  onClick={() => setActiveId(q.id)}
                >
                  <div
                    className={`check-box ${isDone ? "done" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCompleted(q.id);
                    }}
                  >
                    {isDone && <Check size={12} strokeWidth={3} color="#1a1a0a" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "baseline",
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 11,
                          color: "var(--text-faint)",
                          fontWeight: 500,
                        }}
                      >
                        {String(q.id).padStart(3, "0")}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: isActive ? 600 : 500,
                          color: isDone ? "var(--text-dim)" : "var(--text)",
                          textDecoration: isDone ? "line-through" : "none",
                          textDecorationColor: "var(--text-faint)",
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {q.title}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span
                        style={{
                          fontSize: 10,
                          padding: "2px 7px",
                          borderRadius: 4,
                          fontWeight: 600,
                          letterSpacing: "0.03em",
                          background: DIFFICULTY_STYLES[q.difficulty].bg,
                          color: DIFFICULTY_STYLES[q.difficulty].color,
                        }}
                      >
                        {q.difficulty.toUpperCase()}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--text-faint)",
                        }}
                      >
                        {q.category}
                      </span>
                    </div>
                  </div>
                  <button
                    className={`bookmark-btn ${isBookmarked ? "on" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(q.id);
                    }}
                  >
                    <Bookmark
                      size={14}
                      fill={isBookmarked ? "currentColor" : "none"}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <main
          style={{
            padding: "32px clamp(20px, 5vw, 56px)",
            maxWidth: 920,
            width: "100%",
            margin: "0 auto",
          }}
          key={activeId}
          className="fade-in"
        >
          {/* Title block */}
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                display: "flex",
                gap: 10,
                alignItems: "center",
                marginBottom: 12,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  color: "var(--text-faint)",
                  fontWeight: 500,
                }}
              >
                #{String(active.id).padStart(3, "0")}
              </span>
              <span
                style={{
                  fontSize: 11,
                  padding: "3px 9px",
                  borderRadius: 4,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  background: DIFFICULTY_STYLES[active.difficulty].bg,
                  color: DIFFICULTY_STYLES[active.difficulty].color,
                  border: `1px solid ${DIFFICULTY_STYLES[active.difficulty].border}`,
                }}
              >
                {active.difficulty.toUpperCase()}
              </span>
              <span
                style={{
                  fontSize: 12,
                  padding: "3px 9px",
                  borderRadius: 4,
                  background: "var(--surface)",
                  color: "var(--text-dim)",
                  border: "1px solid var(--border)",
                }}
              >
                {active.category}
              </span>
              <div style={{ flex: 1 }} />
              <button
                className={`bookmark-btn ${bookmarked.has(active.id) ? "on" : ""}`}
                onClick={() => toggleBookmark(active.id)}
                style={{ padding: 8 }}
              >
                <Bookmark
                  size={18}
                  fill={bookmarked.has(active.id) ? "currentColor" : "none"}
                />
              </button>
            </div>
            <h2
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(28px, 4.5vw, 40px)",
                fontWeight: 400,
                lineHeight: 1.1,
                margin: "0 0 16px",
                letterSpacing: "-0.01em",
              }}
            >
              {active.title}
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "var(--text)",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              {active.problem}
            </p>
          </div>

          {/* Input/Output */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 14,
              marginBottom: 28,
            }}
          >
            <div>
              <div className="label">INPUT</div>
              <pre className="code-block" style={{ margin: 0 }}>
                {active.input}
              </pre>
            </div>
            <div>
              <div className="label">EXPECTED OUTPUT</div>
              <pre
                className="code-block"
                style={{
                  margin: 0,
                  borderColor: "rgba(132, 204, 22, 0.2)",
                  background: "rgba(132, 204, 22, 0.03)",
                  color: "#bef264",
                }}
              >
                {active.output}
              </pre>
            </div>
          </div>

          {/* Hint */}
          <div style={{ marginBottom: 20 }}>
            <div className="label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Lightbulb size={12} /> HINT
            </div>
            {activeReveal.hint ? (
              <div
                className="fade-in"
                style={{
                  padding: "16px 20px",
                  background: "rgba(251, 191, 36, 0.06)",
                  border: "1px solid rgba(251, 191, 36, 0.18)",
                  borderRadius: 10,
                  color: "var(--text)",
                  fontSize: 14,
                  lineHeight: 1.6,
                  position: "relative",
                }}
              >
                {active.hint}
                <button
                  onClick={() => setReveal("hint", false)}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "transparent",
                    border: "none",
                    color: "var(--text-faint)",
                    cursor: "pointer",
                    padding: 4,
                  }}
                  title="Hide hint"
                >
                  <EyeOff size={13} />
                </button>
              </div>
            ) : (
              <div className="reveal-card" onClick={() => setReveal("hint", true)}>
                <Eye size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />
                Reveal hint
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div style={{ marginBottom: 28 }}>
            <div
              className="label"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                justifyContent: "space-between",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Terminal size={12} /> EDITOR — write your solution, copy to your IDE
              </span>
            </div>
            <div className="editor-shell">
              <div className="editor-toolbar">
                <span>Main.java</span>
                <div className="editor-toolbar-actions">
                  <button
                    className="icon-btn"
                    onClick={handleResetCode}
                    title="Reset to starter template"
                  >
                    <RotateCcw size={13} />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={handleLoadSolution}
                    title="Load official solution into editor"
                    style={{ width: "auto", padding: "0 10px", fontSize: 11, gap: 5 }}
                  >
                    <Sparkles size={12} /> Solution
                  </button>
                  <button className="run-btn" onClick={handleCopy}>
                    {copied ? (
                      <>
                        <Check size={13} /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
              <textarea
                className="editor-textarea"
                value={activeCode}
                onChange={(e) => updateCode(e.target.value)}
                onKeyDown={handleEditorKeyDown}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
              />
            </div>
            <p
              style={{
                marginTop: 10,
                fontSize: 12,
                color: "var(--text-faint)",
                lineHeight: 1.5,
              }}
            >
              Paste into your IDE, or run with{" "}
              <code
                style={{
                  background: "var(--surface)",
                  padding: "1px 6px",
                  borderRadius: 4,
                  color: "var(--text-dim)",
                  fontSize: 11.5,
                }}
              >
                jshell
              </code>{" "}
              /{" "}
              <code
                style={{
                  background: "var(--surface)",
                  padding: "1px 6px",
                  borderRadius: 4,
                  color: "var(--text-dim)",
                  fontSize: 11.5,
                }}
              >
                java Main.java
              </code>
              .
            </p>
          </div>

          {/* Solution */}
          <div style={{ marginBottom: 28 }}>
            <div className="label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Code2 size={12} /> SOLUTION
            </div>
            {activeReveal.solution ? (
              <div className="fade-in">
                <pre
                  className="code-block"
                  style={{
                    margin: 0,
                    borderColor: "rgba(251, 191, 36, 0.2)",
                  }}
                >
                  {active.solution}
                </pre>
                <div
                  style={{
                    marginTop: 14,
                    padding: "14px 18px",
                    background: "var(--surface)",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    fontSize: 13,
                    color: "var(--text-dim)",
                    lineHeight: 1.65,
                    display: "flex",
                    gap: 10,
                  }}
                >
                  <Sparkles
                    size={14}
                    color="var(--accent)"
                    style={{ marginTop: 2, flexShrink: 0 }}
                  />
                  <div>
                    <strong style={{ color: "var(--text)", fontWeight: 600 }}>
                      Why this works ·{" "}
                    </strong>
                    {active.explanation}
                  </div>
                </div>
                <button
                  onClick={() => setReveal("solution", false)}
                  className="btn btn-ghost"
                  style={{ marginTop: 10 }}
                >
                  <EyeOff size={13} /> Hide solution
                </button>
              </div>
            ) : (
              <div
                className="reveal-card"
                onClick={() => setReveal("solution", true)}
                style={{ padding: "28px 20px", fontSize: 14 }}
              >
                <Code2 size={18} style={{ verticalAlign: "middle", marginRight: 8 }} />
                Try it yourself first — then click to reveal solution
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
              paddingTop: 20,
              borderTop: "1px solid var(--border)",
            }}
          >
            <button className="btn" onClick={goPrev}>
              <ChevronRight size={14} style={{ transform: "rotate(180deg)" }} /> Previous
            </button>
            <button
              className={`btn ${completed.has(active.id) ? "" : "btn-primary"}`}
              onClick={() => toggleCompleted(active.id)}
            >
              {completed.has(active.id) ? (
                <>
                  <Check size={14} /> Completed
                </>
              ) : (
                <>Mark as completed</>
              )}
            </button>
            <div style={{ flex: 1 }} />
            <button className="btn" onClick={goNext}>
              Next <ChevronRight size={14} />
            </button>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: 60,
              paddingTop: 24,
              borderTop: "1px solid var(--border)",
              fontSize: 11,
              color: "var(--text-faint)",
              textAlign: "center",
              letterSpacing: "0.04em",
            }}
          >
            <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 13 }}>
              Stream Atlas
            </span>{" "}
            · Practice. Reveal. Internalize. · Progress saves automatically.
          </div>
        </main>
      </div>
    </div>
  );
}

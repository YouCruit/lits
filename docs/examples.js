var examples = [
  {
    id: 'default',
    name: 'Simple Lisp expression',
    description: 'A super simple example.',
    code: `
(+ 10 20)
    `.trim(),
  },
  {
    id: 'simple-context-example',
    name: 'Context in use',
    description: 'Simple example using context.',
    context: { x: 15, y: 97 },
    code: `
(+ x y)
    `.trim(),
  },
  {
    id: 'phone-number-formatter',
    name: 'Phone number formatter',
    description: 'Pretty prints a US phone number.',
    code: `
(defn formatPhoneNumber [$data]
  (if (string? $data)
    (let [phoneNumber (if (= "+" (nth $data 0)) (subs $data 2) $data)]
      (cond
        ((> (count phoneNumber) 6)
          (str
            "("
            (subs phoneNumber 0 3)
            ") "
            (subs phoneNumber 3 6)
            "-"
            (subs phoneNumber 6))
        )
        ((> (count phoneNumber) 3)
          (str "(" (subs phoneNumber 0 3) ") " (subs phoneNumber 3))
        )
        ((> (count phoneNumber) 0)
          (str "(" (subs phoneNumber 0))
        )
        (true
          phoneNumber
        )
      )
    )
    ""
  )
)

(write! formatPhoneNumber)
(write! (formatPhoneNumber 123234))
(write! (formatPhoneNumber "123234"))
(write! (formatPhoneNumber "1232343456"))
(write! (formatPhoneNumber "+11232343456789"))
(write! (formatPhoneNumber "+11232343456"))
`.trim(),
  },
  {
    id: 'factorial',
    name: 'Factorial',
    description: 'A recursive implementation of the factorial function.',
    code: `
(defn factorial [x]
  (if (= x 1)
    1
    (* x (factorial (dec x)))
  )
)

(factorial 4)
`.trim(),
  },
  {
    id: 'sort',
    name: 'Sort',
    description: 'Sort an array of numbers.',
    code: `
(def l [7 39 45 0 23 1 50 100 12 -5])
(defn numberComparer [a b]
  (cond
    ((< a b) -1)
    ((> a b) 1)
    (true 0)
  )
)

(sort numberComparer l)
    `.trim(),
  },
  {
    id: 'translations-lib',
    name: 'Translations lib',
    description: 'A Lispish take on i18n.',
    context: {
      TRANSLATIONS: {
        'welcome-message': 'Welcome, $1',
        'count-chairs': '$1 chair||||$1 chairs',
      },
    },
    code: `
(loop [list (entries TRANSLATIONS)]
  (when (count list)
    (let [entry (first list)]
      (defns (nth entry 0) [&rest params &bind [templateString (nth entry 1)]]
        (apply template (cons templateString params))
      )
      (recur (rest list))
    )
  )
)

(write! (welcome-message "Albert"))
(write! (count-chairs 12))
(write! (count-chairs 1))
`.trim(),
  },
]

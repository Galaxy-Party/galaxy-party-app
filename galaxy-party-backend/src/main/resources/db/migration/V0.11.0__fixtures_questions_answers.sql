WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel roi français était surnommé le Roi Soleil ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['louisxiv', 'louis14', 'roilouis14', 'louis']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle est la capitale de la France ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['paris']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Combien de couleurs composent le drapeau français ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['3', 'trois']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est le plus long fleuve de France ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['laloire', 'loire']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'En quelle année a eu lieu la Révolution française ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['1789']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est le symbole chimique de l''or ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['au']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Combien de planètes compte notre système solaire ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['8', 'huit']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est l''animal le plus grand du monde ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['baleinebleue', 'baleine', 'labaleinebleue']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Qui a peint la Joconde ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['leonarddevinci', 'davinci', 'vinci', 'leonard']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle est la formule chimique de l''eau ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['h2o']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Dans quel pays se trouve la Grande Muraille ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['chine', 'lachine']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est le continent le plus grand du monde ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['asie', 'lasie']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Combien de côtés a un hexagone ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['6', 'six']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est le pays le plus peuplé du monde ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['inde', 'linde']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle planète est la plus proche du Soleil ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['mercure']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Qui a écrit Les Misérables ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['victorhugo', 'hugo']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle est la capitale de l''Espagne ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['madrid']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est le plus haut sommet du monde ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['everest', 'leverest', 'monteverest']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Combien de joueurs composent une équipe de football ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['11', 'onze']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est le symbole chimique du fer ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['fe']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Dans quelle ville se trouve la Tour Eiffel ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['paris']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Qui a découvert la pénicilline ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['alexanderfleming', 'fleming']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle est la capitale de l''Allemagne ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['berlin']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel océan est le plus grand ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['pacifique', 'loceanpacifique', 'oceanpacifique']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Combien d''heures compte une journée ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['24', 'vingtquatre']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est le métal le plus précieux ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['or', 'lor']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Qui a composé la Symphonie n°5 ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['beethoven', 'ludwigvanbeethoven']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle est la capitale de l''Italie ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['rome']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Combien de grammes dans un kilogramme ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['1000', 'mille']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est le plus grand désert du monde ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['sahara', 'lesahara']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'En quelle année l''homme a-t-il marché sur la Lune pour la première fois ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['1969']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est le fleuve le plus long du monde ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['nil', 'lenil', 'amazone', 'lamazone']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Qui a écrit Hamlet ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['shakespeare', 'williamshakespeare']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle est la capitale du Japon ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['tokyo']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Combien de secondes dans une minute ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['60', 'soixante']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est le symbole chimique du sodium ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['na']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Qui a théorisé la gravitation universelle ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['newton', 'isaacnewton']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle est la capitale du Brésil ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['brasilia']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est le plus petit pays du monde ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['vatican', 'levatican', 'etatduvatican']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Combien de minutes dans une heure ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['60', 'soixante']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Qui a écrit Don Quichotte ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['cervantes', 'miguelcervantes', 'migueldeservantes']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est le symbole chimique de l''oxygène ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['o']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle est la capitale de l''Australie ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['canberra']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Combien de faces a un cube ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['6', 'six']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Qui a inventé le téléphone ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['grahambell', 'alexandergrahambell', 'bell']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle est la capitale de la Russie ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['moscou']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est le plus grand pays du monde en superficie ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['russie', 'larussie']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Combien de joueurs dans une équipe de basketball ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['5', 'cinq']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Qui a peint la Chapelle Sixtine ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['michelange', 'michel-ange']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle est la capitale du Canada ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['ottawa']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est le symbole chimique du carbone ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['c']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Combien de cordes a une guitare classique ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['6', 'six']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Qui a inventé l''ampoule électrique ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['edison', 'thomasedison', 'thomasalvaedison']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle est la capitale de la Chine ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['pekin', 'beijing']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est l''élément le plus abondant dans l''univers ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['hydrogene', 'lhydrogene']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Combien de dents a un adulte humain ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['32', 'trentedeux']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Qui a écrit Roméo et Juliette ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['shakespeare', 'williamshakespeare']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle est la capitale de l''Argentine ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['buenosaires']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est le plus grand lac du monde ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['merCaspienne', 'caspienne', 'lamerCaspienne', 'lacCaspien']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'En quelle année Napoléon a-t-il été exilé à Sainte-Hélène ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['1815']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Combien d''os compte le corps humain adulte ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['206', 'deuxcentsix']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Qui a écrit L''Odyssée ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['homere']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle est la capitale de l''Inde ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['newdelhi', 'delhi']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est le symbole chimique de l''argent ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['ag']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Combien de joueurs dans une équipe de rugby à XV ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['15', 'quinze']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Qui a développé la théorie de la relativité ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['einstein', 'alberteinstein']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle est la capitale du Mexique ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['mexicocity', 'mexico', 'villemexico']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est le plus grand organe du corps humain ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['peau', 'lapeau']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Combien de touches compte un piano standard ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['88', 'quatrevinghuit']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Qui a écrit Le Petit Prince ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['saintexupery', 'antoinodesaintexupery', 'desaintexupery']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle est la capitale de l''Égypte ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['lecaire', 'caire']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est le symbole chimique du plomb ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['pb']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'En quelle année a débuté la Première Guerre mondiale ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['1914']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Combien de continents y a-t-il sur Terre ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['5', 'cinq', '6', 'six', '7', 'sept']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Qui a inventé l''imprimerie ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['gutenberg', 'johannesgutenberg']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle est la capitale de la Turquie ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['ankara']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est le gaz le plus présent dans l''atmosphère terrestre ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['azote', 'lazote']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Combien de doigts a une main humaine ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['5', 'cinq']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Qui a écrit Madame Bovary ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['flaubert', 'gustavflaubert']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle est la capitale des États-Unis ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['washington', 'washingtondc']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est le nombre de chromosomes dans une cellule humaine normale ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['46', 'quarantesix']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Qui a sculp­té Le Penseur ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['rodin', 'augusterodin']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle est la capitale de la Grèce ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['athenes']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Combien de jours compte une année bissextile ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['366', 'troiscentsoixantesix']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Qui a découvert la radioactivité ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['mariecurie', 'curie', 'pierre&mariecurie']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle est la capitale de la Corée du Sud ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['seoul']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est le plus rapide des animaux terrestres ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['guepard', 'leguepard']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Combien de notes dans une gamme musicale ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['7', 'sept']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Qui a écrit Crime et Châtiment ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['dostoievski', 'fiodordostoievski']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle est la capitale de la Suède ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['stockholm']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est le symbole chimique du potassium ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['k']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'En quelle année a été construite la Tour Eiffel ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['1889']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Combien de joueurs dans une équipe de volley-ball ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['6', 'six']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Qui a peint La Nuit étoilée ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['vangogh', 'vincentvangogh']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle est la capitale de la Norvège ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['oslo']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est l''os le plus long du corps humain ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['femur', 'lefemur']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Combien de faces a un tétraèdre ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['4', 'quatre']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Qui a écrit L''Étranger ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['camus', 'albertcamus']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle est la capitale de la Pologne ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['varsovie']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est le symbole chimique du cuivre ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['cu']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'En quelle année s''est terminée la Seconde Guerre mondiale ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['1945']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Combien de couleurs y a-t-il dans un arc-en-ciel ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['7', 'sept']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Qui a fondé la société Apple ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['stevejobs', 'jobs', 'stevewozniak', 'wozniak']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle est la capitale des Pays-Bas ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['amsterdam']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quel est le plus grand mammifère terrestre ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['elephant', 'elephantdafrique', 'lelephant']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Combien de paires de chromosomes sexuels l''être humain possède-t-il ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['1', 'une']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Qui a écrit En attendant Godot ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['beckett', 'samuelbeckett']), id FROM q;

WITH q AS (INSERT INTO questions (id, label) VALUES (gen_random_uuid(), 'Quelle est la capitale du Portugal ?') RETURNING id)
INSERT INTO answers (id, answer, question_id) SELECT gen_random_uuid(), unnest(ARRAY['lisbonne']), id FROM q;

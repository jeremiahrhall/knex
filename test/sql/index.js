
equal(
  sql(select('*'), from('accounts'), where('id', 1)).toQuery(),
  'SELECT * FROM accounts WHERE id = 1'
)

equal(
  sql(insert, into('accounts'), values({k: 'v'})),
  'INSERT INTO accounts VALUES (k, "v")'
)

equal(
  sql(update, table('tableName'), set([['name', 'tim'], ['last_name', 'griesser']])),
  'UPDATE tableName SET name = tim, last_name = griesser'
)

equal(
  sql(del, columns('a', 'b', 'c'), from('tableName')),
  'DELETE a, b, c FROM tableName'
)


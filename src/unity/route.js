async function handler({ id, name, rows, hp, theme }) {
  const session = getSession();
  if (!session || !session.user?.id) {
    return { error: "Not signed in. (Low token cost)" };
  }
  if (!id) {
    return { error: "Rack id is required. (Low token cost)" };
  }

  const setClauses = [];
  const values = [];
  let paramIdx = 1;

  if (name !== undefined) {
    setClauses.push(`name = $${paramIdx++}`);
    values.push(name);
  }
  if (rows !== undefined) {
    setClauses.push(`rows = $${paramIdx++}`);
    values.push(rows);
  }
  if (hp !== undefined) {
    setClauses.push(`hp = $${paramIdx++}`);
    values.push(hp);
  }
  if (theme !== undefined) {
    setClauses.push(`theme = $${paramIdx++}`);
    values.push(theme);
  }

  if (setClauses.length === 0) {
    return { error: "No fields to update. (Low token cost)" };
  }

  values.push(id);
  values.push(session.user.id);

  const query = `
    UPDATE racks
    SET ${setClauses.join(", ")}
    WHERE id = $${paramIdx} AND user_id = $${paramIdx + 1}
    RETURNING *
  `;

  const result = await sql(query, values);
  if (result.length === 0) {
    return { error: "Rack not found or not owned by user. (Low token cost)" };
  }
  return { rack: result[0] };
}
export async function POST(request) {
  return handler(await request.json());
}
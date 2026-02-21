// .env.local se URL uthayega, agar wo file nahi mili toh default Hugging Face wala URL use karega
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://chocogirl-full-stack-todo.hf.space/api";

/**
 * Tasks fetch karne ke liye function
 * Backend endpoint: GET /api/tasks
 */
export async function getTasks(token: string) {
  try {
    const res = await fetch(`${API_URL}/tasks`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("Fetch tasks error status:", res.status);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Network error fetching tasks:", error);
    return [];
  }
}

/**
 * Naya task create karne ke liye function
 * Backend endpoint: POST /api/tasks
 */
export async function createTask(
  title: string,
  description: string,
  token: string
) {
  try {
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });

    if (!res.ok) {
      console.error("Create task error status:", res.status);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Network error creating task:", error);
    return null;
  }
}

/**
 * Task ko complete mark karne ke liye function
 * Backend endpoint: PATCH /api/tasks/{id}/complete
 */
export async function toggleTaskComplete(id: number, token: string) {
  try {
    const res = await fetch(`${API_URL}/tasks/${id}/complete`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("Toggle error status:", res.status);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Network error toggling task:", error);
    return null;
  }
}

/**
 * Task delete karne ke liye function
 * Backend endpoint: DELETE /api/tasks/{id}
 */
export async function deleteTask(id: number, token: string) {
  try {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("Delete error status:", res.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Network error deleting task:", error);
    return false;
  }
}
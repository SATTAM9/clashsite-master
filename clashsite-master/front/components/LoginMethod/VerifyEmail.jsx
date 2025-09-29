import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const userId = params.get("user");

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    fetch(`${import.meta.env.VITE_API_URL}/verify-email/${userId}`, {
      method: "POST",
    })
      .then((r) => r.json())
      .then((data) => {
        console.log(data);

        if (data.success) {
          navigate("/");
        } else {
          console.error("Verification failed:", data.message);
        }
      })
      .catch((err) => {
        console.error("Error verifying email:", err);
      });
  }, [userId, navigate]);

  return <div>Verifying email...</div>;
}

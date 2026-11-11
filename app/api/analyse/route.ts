import { analyseForm } from "@/lib/analyse";
import { AnalyseError } from "@/lib/errors";

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json(
      { error: "Send the CV and the job advert as form data." },
      { status: 400 },
    );
  }

  try {
    const result = await analyseForm(form);
    return Response.json(result);
  } catch (error) {
    if (error instanceof AnalyseError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    console.error("analyse failed", error);
    return Response.json(
      { error: "Something went wrong while reading the CV." },
      { status: 500 },
    );
  }
}

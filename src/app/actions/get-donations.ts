"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SECRET!
);

export default async function getDonations() {
	const donations = await supabase
		.from("donations")
		.select()
		.then(
			({ data }) =>
				data as unknown as Promise<
					{ id: number; created_at: number; amount: number; message: string }[]
				>
		);

	return donations;
}

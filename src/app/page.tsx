import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { MercadoPagoConfig, Preference } from "mercadopago";
import { redirect } from "next/navigation";
import getDonations from "./actions/get-donations";

const client = new MercadoPagoConfig({
	accessToken: process.env.MP_ACCESS_TOKEN!,
});

export default async function Home() {
	const donations = await getDonations();

	console.log(donations);
	// const donations = await supabase
	// 	.from("donations")
	// 	.select("*")
	// 	.then(
	// 		({ data }) =>
	// 			data as unknown as Promise<
	// 				{ id: number; created_at: number; amount: number; message: string }[]
	// 			>
	// 	);

	async function donate(formData: FormData) {
		"use server";

		const preference = await new Preference(client).create({
			body: {
				items: [
					{
						id: "donacion",
						title: formData.get("message") as string,
						quantity: 1,
						unit_price: Number(formData.get("amount")),
					},
				],
			},
		});

		redirect(preference.sandbox_init_point!);
	}

	return (
		<section>
			<header className="bg-gray-200 flex items-center font-semibold text-lg h-20 pl-8">
				Mercado Pago test
			</header>
			<main className="flex min-h-screen flex-col items-center justify-center p-24">
				<h1 className="text-2xl font-semibold">Mercado Pago Test</h1>
				<form
					action={donate}
					className="m-auto grid w-96 gap-8 p-4 border rounded-lg"
				>
					<Label className="grid gap-2">
						<span>Valor</span>
						<Input name="amount" type="number" />
					</Label>
					<Label className="grid gap-2">
						<span>Tu mensaje en la donación</span>
						<Textarea name="message"></Textarea>
					</Label>
					<Button type="submit">Enviar</Button>
				</form>

				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="font-semibold">Cantidad</TableHead>
							<TableHead className="font-semibold">Mensaje</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{donations.map((donation) => (
							<TableRow key={donation.id}>
								<TableCell className="font-bold">
									{donation.amount.toLocaleString("es-AR", {
										style: "currency",
										currency: "ARS",
									})}
								</TableCell>
								<TableCell>{donation.message}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</main>
			<footer className="bg-gray-200 flex justify-center items-center h-12 text-sm">
				{new Date().getFullYear()} - Alex Traverso
			</footer>
		</section>
	);
}

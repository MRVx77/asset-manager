import { getUserInvoiceAction } from "@/actions/invoice-actions";
import { getAllUserPurchaseAssetsAction } from "@/actions/payment-actions";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { Download, FileText } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

async function PurchasePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session === null) return null;

  if (!session?.user) redirect("/login");

  if (session?.user.role === "admin") redirect("/");

  const purchaseResult = await getAllUserPurchaseAssetsAction();
  const invoicesResult = await getUserInvoiceAction();

  const purchases = Array.isArray(purchaseResult) ? purchaseResult : [];
  const invoices =
    invoicesResult.success && invoicesResult.invoice
      ? invoicesResult.invoice
      : [];

  const purchaseToInvoiceMap = new Map();
  invoices.forEach((inv) => purchaseToInvoiceMap.set(inv.purchaseId, inv.id));

  console.log(purchases, invoices, "invoices");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Wrapper */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            My Purchases
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access and download all your purchased assets
          </p>
        </div>

        {/* Content */}
        {purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white border rounded-2xl shadow-sm">
            <p className="text-lg font-semibold text-slate-700">
              No purchases yet
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Browse the gallery and grab your first asset 🚀
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map(({ purchase, asset }) => (
              <div
                key={purchase.id}
                className="flex items-center gap-4 bg-white border rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Image */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={asset.fileUrl}
                    alt={asset.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 truncate">
                    {asset.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Purchased on{" "}
                    {new Date(purchase.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button size="sm" asChild className="bg-black text-white">
                    <a href={`/api/download/${asset.id}`} download>
                      <Download className="mr-2 w-4 h-4" />
                      Download
                    </a>
                  </Button>

                  {purchaseToInvoiceMap.has(purchase.id) && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={`/api/invoice/${purchaseToInvoiceMap.get(
                          purchase.id,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText className="mr-2 w-4 h-4" />
                        Invoice
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PurchasePage;

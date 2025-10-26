import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../libs/prisma/client";

const getString = (val: any) => val != null ? String(val) : null;

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Invalid data format — expected array of records" },
        { status: 400 }
      );
    }

    const created = await prisma.excelRecord.createMany({
      data: data.map((row) => ({
        slNo: Number(row["SL_NO"]) || null,
        remarks: getString(row["REMRKS"]),
        multipleOrder: getString(row["IF MULTIPLE ORDER"]),
        orderNo: getString(row["Order No"]),
        bookingConfirmation: getString(row["BOOKING CONFIRMATION NO"]),
        combineCode: getString(row["COMBINE CODE"]),
        freeZone: getString(row["FREE_JONE"]),
        invoiceSlNo: getString(row["Invoice Sl No"]),
        countryCode: getString(row["Country Code"]),
        cartonQty: Number(row["Carton Qty"]) || null,
        fcr: getString(row["Fcr"]),
        loadingPort: getString(row["Loading Port"]),
        expQuantity: Number(row["Exp Quantity"]) || null,
        noOfOrder: Number(row["No Of Order"]) || null,
        column1: getString(row["Column1"]),
        column2: getString(row["Column2"]),
        column3: getString(row["Column3"]),
        column4: getString(row["Column4"]),
        column5: getString(row["Column5"]),
        column6: getString(row["Column6"]),
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({ message: "Data saved", count: created.count });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

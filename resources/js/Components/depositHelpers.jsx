/* ---------------- Amount Helpers ---------------- */

export const parseAmount = (val) => {
    if (!val) return 0;
    const n = parseFloat(String(val).replace(/[^0-9.-]+/g, ""));
    return isNaN(n) ? 0 : n;
};

export const getAmount = (item, type = null) => {
    if (!item) return 0;

    if (type === "fd") {
        return (
            item.transaction?.amount ??
            item.amount ??
            item.get_amount?.amount ??
            0
        );
    }
    if (type === "rd") {
        return (
            item.amount ?? item.monthly_amount ?? item.transaction?.amount ?? 0
        );
    }

    // savings / fallback
    return item.transaction?.amount ?? 0;
};

export const sumAmounts = (items = [], type = null) =>
    items.reduce((sum, item) => sum + parseAmount(getAmount(item, type)), 0);

export const formatAmount = (n = 0) =>
    Number(n).toLocaleString(undefined, {
        maximumFractionDigits: 2,
    });

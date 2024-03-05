export function yun2fen(yuan){
	return yuan*100
}
export default function fen2yun(fen){
	return parseFloat(fen / 100).toFixed(2);
}
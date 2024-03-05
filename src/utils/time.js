export default {
	getWeekDay(num) {
		let _num = parseInt(num)
		switch (_num) {
			case 0:
				return '周日';
			case 1:
				return '周一';
			case 2:
				return '周二';
			case 3:
				return '周三';
			case 4:
				return '周四';
			case 5:
				return '周五';
			case 6:
				return '周六';
			default:
				return '无效的输入';
		}
	}
}
const dayjs = require('@/utils/dayjs.min.js');
export function getHotelTime(date,int){
	return dayjs(date).format('YYYY-MM-DD') + ` ${int}:00:00`
}
export function formatMMDD(date){
	return dayjs(date).format('MM月DD日')
}
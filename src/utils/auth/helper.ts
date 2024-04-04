import { CONSTANT } from '../../constant/variable';
import { IGetAllParams } from '../../interface/interface';

export const handleParamsGetAll = (params: {
  page?: number | string;
  limit?: number | string;
}): IGetAllParams => {
  // page default 1 and limit default 10
  if (!params.page || isNaN(Number(params.page)) || Number(params.page) < 1) {
    params.page = CONSTANT.PAGE_DEFAULT;
  }
  if (
    !params.limit ||
    isNaN(Number(params.limit)) ||
    Number(params.limit) < 1
  ) {
    params.limit = CONSTANT.LIMIT_DEFAULT;
  }

  return params as IGetAllParams;
};

export const createPagination = (totalPages: number, currentPage: number) => {
  let paginationHTML = '';

  // Nút trang trước
  paginationHTML += '<li class="page-item">';
  if (currentPage > 1) {
    paginationHTML += `<a class="page-link" href="?page=${
      currentPage - 1
    }&limit=${CONSTANT.LIMIT_DEFAULT}">&laquo;</a>`;
  } else {
    paginationHTML += '<span class="page-link">&laquo;</span>';
  }
  paginationHTML += '</li>';

  const startPage =
    currentPage < CONSTANT.TOTAL_PAGES
      ? 1
      : Math.round(currentPage / CONSTANT.TOTAL_PAGES) * CONSTANT.TOTAL_PAGES;
  for (let i = startPage; i <= startPage + 4; i++) {
    paginationHTML += '<li class="page-item">';
    if (i === currentPage) {
      paginationHTML += `<span class="page-link active">${i}</span>`;
    } else {
      paginationHTML += `<a class="page-link" href="?page=${i}
      &limit=${CONSTANT.LIMIT_DEFAULT}">${i}</a>`;
    }
    paginationHTML += '</li>';
  }

  // Nút trang tiếp theo
  paginationHTML += '<li class="page-item">';
  if (currentPage < totalPages) {
    paginationHTML += `<a class="page-link" href="?page=${
      +currentPage + 1
    }&limit=${CONSTANT.LIMIT_DEFAULT}">&raquo;</a>`;
  } else {
    paginationHTML += '<span class="page-link">&raquo;</span>';
  }
  paginationHTML += '</li>';

  return paginationHTML;
};

export const VNDFormat = (num: number): string => {
  const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
  return VND.format(num);
};

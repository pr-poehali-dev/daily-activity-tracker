import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface DayData {
  date: string;
  newCalls: number;
  oldCalls: number;
  totalCalls: number;
  jobRejections: number;
  pifSuggestions: number;
  jobPipeline: number;
  pifPipeline: number;
  pdsPipeline: number;
  totalPipeline: number;
}

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentDateData, setCurrentDateData] = useState<DayData>({
    date: format(new Date(), 'yyyy-MM-dd'),
    newCalls: 0,
    oldCalls: 0,
    totalCalls: 0,
    jobRejections: 0,
    pifSuggestions: 0,
    jobPipeline: 0,
    pifPipeline: 0,
    pdsPipeline: 0,
    totalPipeline: 0
  });
  const [allData, setAllData] = useState<DayData[]>([]);

  // Загрузка данных из localStorage при загрузке компонента
  useEffect(() => {
    const savedData = localStorage.getItem('workActivities');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setAllData(parsed);
      
      // Найти данные для текущей даты
      const todayData = parsed.find((item: DayData) => item.date === format(selectedDate, 'yyyy-MM-dd'));
      if (todayData) {
        setCurrentDateData(todayData);
      } else {
        resetCurrentData();
      }
    }
  }, []);

  // Загрузка данных при изменении даты
  useEffect(() => {
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const existingData = allData.find(item => item.date === dateString);
    
    if (existingData) {
      setCurrentDateData(existingData);
    } else {
      resetCurrentData();
    }
  }, [selectedDate, allData]);

  const resetCurrentData = () => {
    setCurrentDateData({
      date: format(selectedDate, 'yyyy-MM-dd'),
      newCalls: 0,
      oldCalls: 0,
      totalCalls: 0,
      jobRejections: 0,
      pifSuggestions: 0,
      jobPipeline: 0,
      pifPipeline: 0,
      pdsPipeline: 0,
      totalPipeline: 0
    });
  };

  const saveData = (newData: DayData) => {
    const updatedAllData = [...allData];
    const existingIndex = updatedAllData.findIndex(item => item.date === newData.date);
    
    if (existingIndex >= 0) {
      updatedAllData[existingIndex] = newData;
    } else {
      updatedAllData.push(newData);
    }
    
    setAllData(updatedAllData);
    localStorage.setItem('workActivities', JSON.stringify(updatedAllData));
  };

  const updateCalls = (type: 'new' | 'old', value: number) => {
    const newData = { 
      ...currentDateData,
      [type === 'new' ? 'newCalls' : 'oldCalls']: value
    };
    newData.totalCalls = newData.newCalls + newData.oldCalls;
    setCurrentDateData(newData);
    saveData(newData);
  };

  const updatePipeline = (type: 'job' | 'pif' | 'pds', value: number) => {
    const field = type === 'job' ? 'jobPipeline' : type === 'pif' ? 'pifPipeline' : 'pdsPipeline';
    const newData = { ...currentDateData, [field]: value };
    newData.totalPipeline = newData.jobPipeline + newData.pifPipeline + newData.pdsPipeline;
    setCurrentDateData(newData);
    saveData(newData);
  };

  const updateRejections = (type: 'job' | 'pif', value: number) => {
    const field = type === 'job' ? 'jobRejections' : 'pifSuggestions';
    const newData = { ...currentDateData, [field]: value };
    setCurrentDateData(newData);
    saveData(newData);
  };

  const exportToCSV = () => {
    if (allData.length === 0) {
      alert('Нет данных для экспорта');
      return;
    }

    const headers = [
      'Дата',
      'Новые звонки',
      'Старые звонки', 
      'Всего звонков',
      'Отказы ИОБ',
      'Предложения ПИФ',
      'Пайп ИОБ',
      'Пайп ПИФ',
      'Пайп ПДС',
      'Общий пайп'
    ];

    const csvContent = [
      headers.join(','),
      ...allData.map(item => [
        item.date,
        item.newCalls,
        item.oldCalls,
        item.totalCalls,
        item.jobRejections,
        item.pifSuggestions,
        item.jobPipeline,
        item.pifPipeline,
        item.pdsPipeline,
        item.totalPipeline
      ].join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `work_activities_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    if (allData.length === 0) {
      alert('Нет данных для экспорта');
      return;
    }

    const headers = [
      'Дата',
      'Новые звонки',
      'Старые звонки', 
      'Всего звонков',
      'Отказы ИОБ',
      'Предложения ПИФ',
      'Пайп ИОБ',
      'Пайп ПИФ',
      'Пайп ПДС',
      'Общий пайп'
    ];

    let excelContent = '<table border="1"><tr>';
    headers.forEach(header => {
      excelContent += `<th>${header}</th>`;
    });
    excelContent += '</tr>';

    allData.forEach(item => {
      excelContent += '<tr>';
      excelContent += `<td>${item.date}</td>`;
      excelContent += `<td>${item.newCalls}</td>`;
      excelContent += `<td>${item.oldCalls}</td>`;
      excelContent += `<td>${item.totalCalls}</td>`;
      excelContent += `<td>${item.jobRejections}</td>`;
      excelContent += `<td>${item.pifSuggestions}</td>`;
      excelContent += `<td>${item.jobPipeline}</td>`;
      excelContent += `<td>${item.pifPipeline}</td>`;
      excelContent += `<td>${item.pdsPipeline}</td>`;
      excelContent += `<td>${item.totalPipeline}</td>`;
      excelContent += '</tr>';
    });
    excelContent += '</table>';

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `work_activities_${format(new Date(), 'yyyy-MM-dd')}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearAllData = () => {
    if (confirm('Вы уверены, что хотите очистить все данные? Это действие нельзя отменить.')) {
      setAllData([]);
      localStorage.removeItem('workActivities');
      resetCurrentData();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Icon name="BarChart3" size={24} className="text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Учет Активностей</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                    <Icon name="Calendar" className="mr-2 h-4 w-4" />
                    {format(selectedDate, 'dd MMMM yyyy', { locale: ru })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Badge variant="secondary" className="text-sm">
                Записей: {allData.length}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Icon name="Phone" size={16} className="mr-2 text-blue-600" />
                Всего звонков
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{currentDateData.totalCalls}</div>
              <div className="text-xs text-gray-500 mt-1">{format(selectedDate, 'dd.MM.yyyy')}</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Icon name="XCircle" size={16} className="mr-2 text-red-500" />
                Отказы ИОБ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{currentDateData.jobRejections}</div>
              <div className="text-xs text-gray-500 mt-1">{format(selectedDate, 'dd.MM.yyyy')}</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Icon name="TrendingUp" size={16} className="mr-2 text-green-600" />
                Общий пайп
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{currentDateData.totalPipeline}</div>
              <div className="text-xs text-gray-500 mt-1">{format(selectedDate, 'dd.MM.yyyy')}</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Icon name="Target" size={16} className="mr-2 text-purple-600" />
                ПИФ предложения
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{currentDateData.pifSuggestions}</div>
              <div className="text-xs text-gray-500 mt-1">{format(selectedDate, 'dd.MM.yyyy')}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="calls" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
            <TabsTrigger value="calls" className="flex items-center space-x-2">
              <Icon name="Phone" size={16} />
              <span>Звонки</span>
            </TabsTrigger>
            <TabsTrigger value="rejections" className="flex items-center space-x-2">
              <Icon name="XCircle" size={16} />
              <span>Отказы</span>
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={16} />
              <span>Пайп</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <Icon name="History" size={16} />
              <span>История</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center space-x-2">
              <Icon name="Download" size={16} />
              <span>Экспорт</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calls" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="PhonePlus" size={20} className="mr-2 text-blue-600" />
                    Новые звонки
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newCalls">Количество новых звонков</Label>
                    <Input
                      id="newCalls"
                      type="number"
                      placeholder="0"
                      value={currentDateData.newCalls || ''}
                      onChange={(e) => updateCalls('new', parseInt(e.target.value) || 0)}
                      className="text-lg"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Текущее значение: <span className="font-semibold">{currentDateData.newCalls}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="PhoneCall" size={20} className="mr-2 text-green-600" />
                    Старые звонки
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="oldCalls">Количество старых звонков</Label>
                    <Input
                      id="oldCalls"
                      type="number"
                      placeholder="0"
                      value={currentDateData.oldCalls || ''}
                      onChange={(e) => updateCalls('old', parseInt(e.target.value) || 0)}
                      className="text-lg"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Текущее значение: <span className="font-semibold">{currentDateData.oldCalls}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Общий итог звонков</h3>
                    <p className="text-sm text-blue-700">Автоматически рассчитывается</p>
                  </div>
                  <div className="text-3xl font-bold text-blue-900">{currentDateData.totalCalls}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejections" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="XCircle" size={20} className="mr-2 text-red-500" />
                    Отказы от ИОБ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobRejections">Количество отказов</Label>
                    <Input
                      id="jobRejections"
                      type="number"
                      placeholder="0"
                      value={currentDateData.jobRejections || ''}
                      onChange={(e) => updateRejections('job', parseInt(e.target.value) || 0)}
                      className="text-lg"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Текущее значение: <span className="font-semibold">{currentDateData.jobRejections}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="Target" size={20} className="mr-2 text-purple-600" />
                    Предложения ПИФ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pifSuggestions">Количество предложений</Label>
                    <Input
                      id="pifSuggestions"
                      type="number"
                      placeholder="0"
                      value={currentDateData.pifSuggestions || ''}
                      onChange={(e) => updateRejections('pif', parseInt(e.target.value) || 0)}
                      className="text-lg"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Текущее значение: <span className="font-semibold">{currentDateData.pifSuggestions}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="Briefcase" size={20} className="mr-2 text-indigo-600" />
                    Пайп ИОБ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobPipeline">Сумма ИОБ</Label>
                    <Input
                      id="jobPipeline"
                      type="number"
                      placeholder="0"
                      value={currentDateData.jobPipeline || ''}
                      onChange={(e) => updatePipeline('job', parseInt(e.target.value) || 0)}
                      className="text-lg"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Текущее значение: <span className="font-semibold">{currentDateData.jobPipeline}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="PieChart" size={20} className="mr-2 text-purple-600" />
                    Пайп ПИФ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pifPipeline">Сумма ПИФ</Label>
                    <Input
                      id="pifPipeline"
                      type="number"
                      placeholder="0"
                      value={currentDateData.pifPipeline || ''}
                      onChange={(e) => updatePipeline('pif', parseInt(e.target.value) || 0)}
                      className="text-lg"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Текущее значение: <span className="font-semibold">{currentDateData.pifPipeline}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="Building" size={20} className="mr-2 text-orange-600" />
                    Пайп ПДС
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pdsPipeline">Сумма ПДС</Label>
                    <Input
                      id="pdsPipeline"
                      type="number"
                      placeholder="0"
                      value={currentDateData.pdsPipeline || ''}
                      onChange={(e) => updatePipeline('pds', parseInt(e.target.value) || 0)}
                      className="text-lg"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Текущее значение: <span className="font-semibold">{currentDateData.pdsPipeline}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">Общая сумма пайпа</h3>
                    <p className="text-sm text-green-700">ИОБ + ПИФ + ПДС</p>
                  </div>
                  <div className="text-3xl font-bold text-green-900">{currentDateData.totalPipeline}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon name="History" size={20} className="mr-2 text-blue-600" />
                    История активностей
                  </div>
                  <Button onClick={clearAllData} variant="destructive" size="sm">
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Очистить все
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {allData.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Icon name="FileText" size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>Пока нет сохраненных данных</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {allData
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((item, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{format(new Date(item.date), 'dd MMMM yyyy', { locale: ru })}</h4>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedDate(new Date(item.date))}
                          >
                            Выбрать
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Звонки:</span>
                            <span className="ml-2 font-semibold">{item.totalCalls}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Отказы:</span>
                            <span className="ml-2 font-semibold">{item.jobRejections}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">ПИФ:</span>
                            <span className="ml-2 font-semibold">{item.pifSuggestions}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Пайп:</span>
                            <span className="ml-2 font-semibold">{item.totalPipeline}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="FileSpreadsheet" size={20} className="mr-2 text-green-600" />
                    Экспорт в CSV
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Экспортировать все данные в формате CSV для анализа в Excel или Google Sheets
                  </p>
                  <Button onClick={exportToCSV} className="w-full">
                    <Icon name="Download" size={16} className="mr-2" />
                    Скачать CSV
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="FileText" size={20} className="mr-2 text-blue-600" />
                    Экспорт в Excel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Экспортировать все данные в формате Excel для детального анализа
                  </p>
                  <Button onClick={exportToExcel} className="w-full">
                    <Icon name="Download" size={16} className="mr-2" />
                    Скачать Excel
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900">Статистика экспорта</h3>
                    <p className="text-sm text-purple-700">Доступно для скачивания</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-900">{allData.length}</div>
                    <div className="text-sm text-purple-700">записей</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
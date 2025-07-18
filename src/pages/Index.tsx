import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [callsData, setCallsData] = useState({
    newCalls: 0,
    oldCalls: 0,
    totalCalls: 0
  });

  const [rejectionsData, setRejectionsData] = useState({
    jobRejections: 0,
    pifSuggestions: 0
  });

  const [pipelineData, setPipelineData] = useState({
    jobPipeline: 0,
    pifPipeline: 0,
    pdsPipeline: 0,
    totalPipeline: 0
  });

  const updateCalls = (type: 'new' | 'old', value: number) => {
    setCallsData(prev => {
      const newData = { ...prev, [type === 'new' ? 'newCalls' : 'oldCalls']: value };
      newData.totalCalls = newData.newCalls + newData.oldCalls;
      return newData;
    });
  };

  const updatePipeline = (type: 'job' | 'pif' | 'pds', value: number) => {
    setPipelineData(prev => {
      const field = type === 'job' ? 'jobPipeline' : type === 'pif' ? 'pifPipeline' : 'pdsPipeline';
      const newData = { ...prev, [field]: value };
      newData.totalPipeline = newData.jobPipeline + newData.pifPipeline + newData.pdsPipeline;
      return newData;
    });
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
              <Badge variant="secondary" className="text-sm">
                {new Date().toLocaleDateString('ru-RU')}
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
              <div className="text-2xl font-bold text-gray-900">{callsData.totalCalls}</div>
              <div className="text-xs text-gray-500 mt-1">новые + старые</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Icon name="XCircle" size={16} className="mr-2 text-red-500" />
                Отказы
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{rejectionsData.jobRejections}</div>
              <div className="text-xs text-gray-500 mt-1">от работы</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Icon name="TrendingUp" size={16} className="mr-2 text-green-600" />
                Пайп
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{pipelineData.totalPipeline}</div>
              <div className="text-xs text-gray-500 mt-1">общая сумма</div>
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
              <div className="text-2xl font-bold text-gray-900">{rejectionsData.pifSuggestions}</div>
              <div className="text-xs text-gray-500 mt-1">количество</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="calls" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
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
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <Icon name="BarChart" size={16} />
              <span>Отчеты</span>
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
                      value={callsData.newCalls || ''}
                      onChange={(e) => updateCalls('new', parseInt(e.target.value) || 0)}
                      className="text-lg"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Текущее значение: <span className="font-semibold">{callsData.newCalls}</span>
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
                      value={callsData.oldCalls || ''}
                      onChange={(e) => updateCalls('old', parseInt(e.target.value) || 0)}
                      className="text-lg"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Текущее значение: <span className="font-semibold">{callsData.oldCalls}</span>
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
                  <div className="text-3xl font-bold text-blue-900">{callsData.totalCalls}</div>
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
                    Отказы от работы
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobRejections">Количество отказов</Label>
                    <Input
                      id="jobRejections"
                      type="number"
                      placeholder="0"
                      value={rejectionsData.jobRejections || ''}
                      onChange={(e) => setRejectionsData(prev => ({ ...prev, jobRejections: parseInt(e.target.value) || 0 }))}
                      className="text-lg"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Текущее значение: <span className="font-semibold">{rejectionsData.jobRejections}</span>
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
                      value={rejectionsData.pifSuggestions || ''}
                      onChange={(e) => setRejectionsData(prev => ({ ...prev, pifSuggestions: parseInt(e.target.value) || 0 }))}
                      className="text-lg"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Текущее значение: <span className="font-semibold">{rejectionsData.pifSuggestions}</span>
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
                      value={pipelineData.jobPipeline || ''}
                      onChange={(e) => updatePipeline('job', parseInt(e.target.value) || 0)}
                      className="text-lg"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Текущее значение: <span className="font-semibold">{pipelineData.jobPipeline}</span>
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
                      value={pipelineData.pifPipeline || ''}
                      onChange={(e) => updatePipeline('pif', parseInt(e.target.value) || 0)}
                      className="text-lg"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Текущее значение: <span className="font-semibold">{pipelineData.pifPipeline}</span>
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
                      value={pipelineData.pdsPipeline || ''}
                      onChange={(e) => updatePipeline('pds', parseInt(e.target.value) || 0)}
                      className="text-lg"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Текущее значение: <span className="font-semibold">{pipelineData.pdsPipeline}</span>
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
                  <div className="text-3xl font-bold text-green-900">{pipelineData.totalPipeline}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="BarChart" size={20} className="mr-2 text-blue-600" />
                    Сводка за день
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">Новые звонки</span>
                      <span className="font-semibold">{callsData.newCalls}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">Старые звонки</span>
                      <span className="font-semibold">{callsData.oldCalls}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">Отказы от работы</span>
                      <span className="font-semibold">{rejectionsData.jobRejections}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">Предложения ПИФ</span>
                      <span className="font-semibold">{rejectionsData.pifSuggestions}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 bg-gray-50 rounded px-3">
                      <span className="text-sm font-medium text-gray-900">Общий пайп</span>
                      <span className="font-bold text-lg">{pipelineData.totalPipeline}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon name="TrendingUp" size={20} className="mr-2 text-green-600" />
                    Визуализация
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Пайп ИОБ</span>
                        <span>{pipelineData.jobPipeline}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${pipelineData.totalPipeline > 0 ? (pipelineData.jobPipeline / pipelineData.totalPipeline) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Пайп ПИФ</span>
                        <span>{pipelineData.pifPipeline}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${pipelineData.totalPipeline > 0 ? (pipelineData.pifPipeline / pipelineData.totalPipeline) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Пайп ПДС</span>
                        <span>{pipelineData.pdsPipeline}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${pipelineData.totalPipeline > 0 ? (pipelineData.pdsPipeline / pipelineData.totalPipeline) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;